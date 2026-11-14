import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pause, Rocket, X, LayoutDashboard } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/settings/SettingsProvider";
import { useCampaign } from "@/lib/mission/useCampaign";
import { currentDay, dayObjectives, daySteps, missionDefinition, DAYS_PER_MISSION } from "@/lib/sim/campaignEngine";
import { playChime } from "@/lib/sound";
import MissionTopBar from "@/components/mission/MissionTopBar";
import ResourceGrid from "@/components/mission/ResourceGrid";
import OutpostMap from "@/components/mission/OutpostMap";
import CommsPanel from "@/components/mission/CommsPanel";
import DayReport from "@/components/mission/DayReport";
import MissionReview from "@/components/mission/MissionReview";
import DayBriefingCard from "@/components/mission/day/DayBriefingCard";
import EnvironmentCard from "@/components/mission/day/EnvironmentCard";
import CrewAssignCard from "@/components/mission/day/CrewAssignCard";
import ResourcePostureCard from "@/components/mission/day/ResourcePostureCard";
import DayActivitiesCard from "@/components/mission/day/DayActivitiesCard";
import DayEventCard from "@/components/mission/day/DayEventCard";
import MissionControlCard from "@/components/mission/day/MissionControlCard";
import DayCloseCard from "@/components/mission/day/DayCloseCard";
import MissionLog from "@/components/mission/day/MissionLog";

export const Route = createFileRoute("/mission")({
  head: () => ({ meta: [{ title: "Mission control — LUNA" }] }),
  component: MissionPage,
});

function MissionPage() {
  const t = useT();
  const { sound } = useSettings();
  const { mission, ready, observe, assign, posture, runActivities, decide, advance, respond, ask, canClose, retry } = useCampaign();
  const [paused, setPaused] = useState(false);
  const [report, setReport] = useState(null);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[hsl(var(--background))]">
        <p className="text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="grid min-h-screen place-items-center bg-[hsl(var(--background))] px-5">
        <div className="glass-strong max-w-md p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
            <Rocket className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-heading text-xl font-semibold">{t("mis.none.title")}</h1>
          <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("mis.none.text")}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/campaign" className="btn-primary">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {t("camp.title")}
            </Link>
            <Link to="/compare" className="btn-ghost">
              {t("nav.compare")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const def = missionDefinition(mission);
  const day = currentDay(mission);
  const steps = daySteps(mission);
  const objectives = dayObjectives(mission);
  const ended = mission.phase !== "active";

  const handleAdvance = () => {
    if (!canClose) return;
    const next = advance();
    if (next?.lastReport) setReport(next.lastReport);
    playChime(sound);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pb-24">
      <MissionTopBar
        mission={mission}
        title={`${t("camp.missionTitle", { n: mission.missionIndex })} · ${def.title}`}
        paused={paused}
        onTogglePause={() => setPaused((v) => !v)}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-4">
        <ResourceGrid mission={mission} />
      </div>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <DayBriefingCard day={day} total={DAYS_PER_MISSION} />
          <EnvironmentCard day={day} mission={mission} observed={steps.observed} onObserve={observe} />
          <CrewAssignCard
            day={day}
            assignments={mission.dayState.assignments}
            onAssign={assign}
            done={steps.crewDone}
            assignedCount={steps.assigned}
          />
          <ResourcePostureCard posture={mission.dayState.posture} onChoose={posture} />
          <DayActivitiesCard
            day={day}
            assignments={mission.dayState.assignments}
            results={mission.dayState.results}
            ran={steps.activitiesDone}
            onRun={runActivities}
            crewDone={steps.crewDone}
          />
          <DayEventCard event={day.event} choiceId={mission.dayState.eventChoice} onChoose={decide} />
          <MissionControlCard day={day} mission={mission} />
          <DayCloseCard objectives={objectives} canClose={canClose} onClose={handleAdvance} />
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OutpostMap mission={mission} />
          <CommsPanel mission={mission} onRespond={respond} onAsk={ask} />
          <MissionLog history={mission.dayHistory} />
        </div>
      </main>

      {paused && (
        <div className="fixed inset-0 z-[75] grid place-items-center bg-[#05091c]/85 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-sm p-7 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
              <Pause className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-xl font-semibold">{t("mis.paused.title")}</h2>
            <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("mis.paused.text")}</p>
            <button type="button" onClick={() => setPaused(false)} className="btn-primary mt-5 w-full">
              {t("mis.resume")}
            </button>
            <Link to="/campaign" className="btn-ghost mt-2 w-full">
              <X className="h-4 w-4" aria-hidden="true" />
              {t("mis.paused.leave")}
            </Link>
          </div>
        </div>
      )}

      {report && <DayReport report={report} onClose={() => setReport(null)} />}
      {ended && !report && <MissionReview mission={mission} onRetry={retry} />}
    </div>
  );
}
