import React, { useEffect, useState } from "react";
import { ref, onValue, runTransaction } from "firebase/database";
import { db } from "../firebase";
import "./Poll.css";

const Poll = ({ pollId }) => {
    const [poll, setPoll] = useState(null);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        const voted = JSON.parse(localStorage.getItem("votedPolls") || "{}");
        setUserVote(voted[pollId]);

        const pollRef = ref(db, `polls/${pollId}`);
        const unsubscribe = onValue(pollRef, (snap) => {
            if (snap.exists()) setPoll(snap.val());
        });

        return () => unsubscribe();
    }, [pollId]);

    const vote = (optionKey) => {
        const voted = JSON.parse(localStorage.getItem("votedPolls") || "{}");
        const previousVote = voted[pollId];

        if (previousVote === optionKey) return;

        if (previousVote) {
            const oldVoteRef = ref(db, `polls/${pollId}/options/${previousVote}/votes`);
            runTransaction(oldVoteRef, (v) => (v || 1) - 1).catch(console.error);
        }

        const newVoteRef = ref(db, `polls/${pollId}/options/${optionKey}/votes`);
        runTransaction(newVoteRef, (v) => (v || 0) + 1)
            .then(() => {
                voted[pollId] = optionKey;
                localStorage.setItem("votedPolls", JSON.stringify(voted));
                setUserVote(optionKey);
            })
            .catch(console.error);
    };

    if (!poll) return null;

    const totalVotes = Object.values(poll.options).reduce((sum, o) => sum + o.votes, 0) || 1;

    return (
        <div className="poll-container">
            <h2 className="poll-question">{poll.question}</h2>
            <div className="poll-options">
                {Object.entries(poll.options).map(([key, opt]) => {
                    const percent = Math.round((opt.votes / totalVotes) * 100);
                    const isUserChoice = userVote === key;

                    return (
                        <div key={key} className="poll-option">
                            <button
                                className={`poll-button ${isUserChoice ? "selected" : ""}`}
                                onClick={() => vote(key)}
                            >
                                {opt.text} ({opt.votes})
                            </button>
                            <div className="poll-bar-background">
                                <div
                                    className={`poll-bar ${isUserChoice ? "selected-bar" : ""}`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Poll;
