import React from "react";
import { STEPS } from "../data";
import { StepKey, SurveyAnswers } from "../types";
import { Check, ArrowRight, Play } from "lucide-react";

interface StepTimelineProps {
  currentStepIndex: number;
  answers: SurveyAnswers;
  onStepClick: (index: number) => void;
  highestStepReached: number;
}

export default function StepTimeline({
  currentStepIndex,
  answers,
  onStepClick,
  highestStepReached,
}: StepTimelineProps) {
  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
        <h3 className="font-sans font-bold text-slate-900 text-xs tracking-wider uppercase">
          수집 진행 타임라인
        </h3>
      </div>

      <div className="space-y-2.5">
        {STEPS.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex || (answers[step.key] && (Array.isArray(answers[step.key]) ? (answers[step.key] as string[]).length > 0 : answers[step.key] !== ""));
          const isPlayable = idx <= highestStepReached;

          let answerPreview = "";
          if (isCompleted) {
            const rawAns = answers[step.key];
            if (Array.isArray(rawAns)) {
              answerPreview = rawAns.length > 0 ? rawAns.join(", ") : "";
            } else {
              answerPreview = rawAns;
            }
          }

          return (
            <button
              key={step.key}
              onClick={() => isPlayable && onStepClick(idx)}
              disabled={!isPlayable}
              id={`timeline-step-${step.key}`}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border text-xs group ${
                isCurrent
                  ? "bg-indigo-600/10 border-indigo-500/30 shadow-xs"
                  : isCompleted && isPlayable
                  ? "bg-white/20 hover:bg-white/40 border-white/30 hover:border-white/50 cursor-pointer"
                  : "bg-transparent border-transparent opacity-30 cursor-not-allowed"
              }`}
            >
              <div
                className={`flex items-center justify-center h-5 w-5 rounded-full font-mono text-[9px] font-bold shrink-0 transition-all border-2 ${
                  isCurrent
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50"
                    : isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-white/40 text-slate-400 bg-white/40"
                }`}
              >
                {isCompleted ? <Check className="h-2 w-2 stroke-[3px]" /> : idx}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium tracking-tight text-xs ${
                      isCurrent 
                        ? "text-indigo-600 font-semibold" 
                        : isCompleted 
                        ? "text-slate-800" 
                        : "text-slate-400"
                    }`}
                  >
                    {step.title.split(".")[1] || step.title}
                  </p>
                  {isCurrent && (
                    <Play className="h-2.5 w-2.5 text-indigo-500 fill-indigo-500 animate-pulse" />
                  )}
                </div>

                {isCompleted && answerPreview && (
                  <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px] font-medium bg-white/40 px-2 py-0.5 rounded border border-white/40 inline-block">
                    {answerPreview}
                  </p>
                )}
                {!isCompleted && isCurrent && (
                  <p className="text-[10px] text-indigo-500 mt-0.5 font-medium">
                    답변 입력 중...
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-white/30 bg-white/25 p-3 rounded-xl">
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          💡 각 단계를 직접 클릭하면 해당 질문으로 즉시 순간이동하여 언제든지 기획 정보를 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
