import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';

export const ElectionsTab: React.FC = () => {
  const { elections, castVote, user } = useData();
  const [votedNotice, setVotedNotice] = useState<string | null>(null);

  const handleVote = (positionId: string, candidateId: string, candidateName: string) => {
    const success = castVote(positionId, candidateId);
    if (success) {
      setVotedNotice(`Your vote for "${candidateName}" has been successfully recorded.`);
      setTimeout(() => setVotedNotice(null), 3500);
    } else {
      setVotedNotice(`You have already cast your ballot for this position.`);
      setTimeout(() => setVotedNotice(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                ACTIVE E-BALLOT
              </span>
              <span className="text-xs text-slate-400">Term: {elections.term}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center space-x-2">
              <Vote className="w-6 h-6 text-amber-400" />
              <span>{elections.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Democratic, secure alumni voting. Select and empower your association leadership for 2026-2028.
            </p>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block">Total Verified Ballots</span>
            <span className="text-2xl font-bold text-amber-400">{elections.totalVotesCast} Votes</span>
          </div>
        </div>

        {votedNotice && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{votedNotice}</span>
          </div>
        )}
      </div>

      {/* Positions and Candidates */}
      <div className="space-y-8">
        {elections.positions.map((pos) => {
          const totalPositionVotes = pos.candidates.reduce((sum, c) => sum + c.votes, 0);

          return (
            <div
              key={pos.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{pos.title}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">
                    {totalPositionVotes} votes in category
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {pos.description}
                </p>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pos.candidates.map((candidate) => {
                  const votePercent = totalPositionVotes > 0
                    ? Math.round((candidate.votes / totalPositionVotes) * 100)
                    : 0;

                  return (
                    <div
                      key={candidate.id}
                      className="bg-slate-800/60 border border-slate-700/70 hover:border-amber-500/50 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-600"
                          />
                          <div>
                            <h4 className="text-base font-bold text-white">
                              {candidate.name}
                            </h4>
                            <p className="text-xs text-amber-400 font-medium">
                              Batch {candidate.batch} • {candidate.city}
                            </p>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {candidate.profession}
                            </p>
                          </div>
                        </div>

                        {/* Manifesto */}
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <span className="font-semibold text-slate-200 block mb-1 text-[11px] uppercase tracking-wider text-amber-400">
                            Manifesto & Vision:
                          </span>
                          "{candidate.manifesto}"
                        </div>

                        {/* Vote stats */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">{candidate.votes} Votes</span>
                            <span className="text-amber-400">{votePercent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${votePercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleVote(pos.id, candidate.id, candidate.name)}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Vote className="w-4 h-4" />
                          <span>Cast Ballot for {candidate.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
