import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Rocket, Users, CalendarDays, MapPin, Target, Satellite, RefreshCw } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { CREW, ACCENTS } from "@/lib/content/crew";
import { store } from "@/lib/mission/store";
import { useCampaign } from "@/lib/mission/useCampaign";
import { getMission, TOTAL_MISSIONS } from "@/lib/sim/campaignEngine";
import { getSpaceWeather } from "@/lib/server-fns";
import { StarField } from "@/components/brand/StarField";

export const Route = createFileRoute("/briefing")({
  validateSearch: (search) => ({ mission: search.mission }),
  head: () => ({ meta: [{ title: "Mission briefing — LUNA" }] }),
  component: BriefingPage,
});

const OBJECTIVES = ["obj.1", "obj.2", "obj.3", "obj.4", "obj.5", "obj.6", "obj.7"];
const EMBLEMS = [
  { id: "crescent", glyph: "☾", color: "#4EDBE8" },
  { id: "comet", glyph: "☄", color: "#FFAD55" },
  { id: "orbit", glyph: "◍", color: "#B8A8FF" },
  { id: "star", glyph: "✦", color: "#83D9B2" },
];

function BriefingPage() {
  const t = useT();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { start: startMission } = useCampaign();
  const missionIndex = Math.min(Math.max(1, Number(search?.mission) || 1), TOTAL_MISSIONS);
  const missionDef = getMission(missionIndex);
  const fetchWeather = useServerFn(getSpaceWeather);
  const [name, setName] = useState("");
  const [emblem, setEmblem] = useState("crescent");
  const [seed, setSeed] = useState("7");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const profile = store.getProfile();
    if (profile?.name) setName(profile.name);
    if (profile?.emblem) setEmblem(profile.emblem);
    setMounted(true);
  }, []);

  const { data: weather, isFetching, refetch } = useQuery({
    queryKey: ["space-weather"],
    queryFn: () => fetchWeather(),
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const start = () => {
    const commanderName = name.trim() || "Commander";
    store.setProfile({ name: commanderName, emblem });
    startMission(missionIndex, {
      seed: Number(seed) || 7,
      commander: { name: commanderName },
      emblem,
      nasaEvent: weather?.events?.[0] || null,
    });
    navigate({ to: "/mission" });
  };

  const latest = weather?.events?.[0];

  return (
    <div className="relative">
      <StarField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12">
        <p className="pill text-[hsl(var(--luna-cyan))]">{t("brief.eyebrow")}</p>
        <h1 className="mt-5 font-heading text-3xl font-semibold text-[hsl(var(--luna-cream))] sm:text-4xl">{t("brief.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("brief.sub")}</p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-cyan))]">
            {t("camp.missionTitle", { n: missionIndex })} · {missionDef.subtitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{missionDef.focus}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Rocket, label: t("brief.mission"), value: `${t("camp.missionTitle", { n: missionIndex })} · ${missionDef.title}` },
            { icon: Users, label: t("brief.crew"), value: t("brief.crewValue") },
            { icon: CalendarDays, label: t("brief.duration"), value: t("brief.durationValue") },
            { icon: MapPin, label: t("brief.location"), value: t("brief.locationValue") },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-surface">
              <Icon className="h-4 w-4 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]/75">{label}</p>
              <p className="mt-1 text-sm font-semibold text-[hsl(var(--luna-cream))]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section>
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
              <Target className="h-4 w-4 text-[hsl(var(--luna-orange))]" aria-hidden="true" />
              {t("brief.objectives")}
            </h2>
            <ul className="mt-4 space-y-2">
              {OBJECTIVES.map((key) => (
                <li key={key} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-[hsl(var(--luna-lavender))]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--luna-cyan))]" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/80">
              {t("brief.disclaimer")}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold">{t("crew.title")}</h2>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {CREW.map((member) => (
                <div key={member.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className={`grid h-11 w-11 place-items-center rounded-full font-heading text-sm font-bold ring-1 ${ACCENTS[member.accent]}`}>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <p className="mt-2.5 text-sm font-semibold text-[hsl(var(--luna-cream))]">{member.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--luna-cyan))]">{t(member.roleKey)}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`crew.duty.${member.id}`)}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]/60">{t("crew.fictional")}</p>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="glass p-6">
            <h2 className="font-heading text-lg font-semibold">{t("brief.commander")}</h2>
            <label className="mt-4 block text-xs font-medium text-[hsl(var(--luna-lavender))]" htmlFor="commander-name">
              {t("brief.name")}
            </label>
            <input
              id="commander-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder={t("brief.namePlaceholder")}
              className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-[hsl(var(--luna-cream))] placeholder:text-[hsl(var(--luna-lavender))]/50"
            />

            <p className="mt-4 text-xs font-medium text-[hsl(var(--luna-lavender))]">{t("brief.emblem")}</p>
            <div className="mt-2 flex gap-2">
              {EMBLEMS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEmblem(e.id)}
                  aria-pressed={emblem === e.id}
                  aria-label={t(`emblem.${e.id}`)}
                  className={`focus-ring grid h-12 w-12 place-items-center rounded-2xl border text-xl transition ${
                    emblem === e.id ? "border-white/60 bg-white/15" : "border-white/15 bg-white/[0.04] hover:bg-white/10"
                  }`}
                  style={{ color: e.color }}
                >
                  {e.glyph}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-medium text-[hsl(var(--luna-lavender))]" htmlFor="seed">
              {t("brief.seed")}
            </label>
            <input
              id="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              inputMode="numeric"
              className="focus-ring mt-1.5 w-32 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm"
            />
            <p className="mt-1.5 text-[11px] text-[hsl(var(--luna-lavender))]/70">{t("brief.seedHint")}</p>

            <button type="button" onClick={start} className="btn-primary mt-6 w-full">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              {t("brief.begin")}
            </button>
          </section>

          <section className="glass p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
                <Satellite className="h-4 w-4 text-[hsl(var(--luna-orange))]" aria-hidden="true" />
                {t("brief.weather")}
              </h2>
              <button
                type="button"
                onClick={() => refetch()}
                className="focus-ring rounded-full p-2 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
                aria-label={t("common.retry")}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>

            {isFetching && <p className="mt-4 text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</p>}
            {weather && !isFetching && (
              <>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                    weather.status === "live"
                      ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]"
                      : "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]"
                  }`}
                >
                  {weather.status === "live" ? t("obs.live") : t("obs.archived")}
                </span>
                <p className="mt-2 text-[11px] text-[hsl(var(--luna-lavender))]">{weather.dataset}</p>

                {latest ? (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="font-heading text-lg font-semibold text-[hsl(var(--luna-cream))]">
                      {latest.classType ? `Class ${latest.classType}` : t("obs.observation")}
                    </p>
                    <p className="mt-1 text-[11px] text-[hsl(var(--luna-lavender))]">
                      {latest.beginTime ? new Date(latest.beginTime).toISOString().slice(0, 16).replace("T", " ") + " UTC" : ""}
                      {latest.sourceLocation ? ` · ${latest.sourceLocation}` : ""}
                    </p>
                    {latest.note && <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{latest.note}</p>}
                    <a href={latest.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-semibold text-[hsl(var(--luna-cyan))] underline">
                      {t("obs.readSource")}
                    </a>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[hsl(var(--luna-lavender))]">{t("obs.noEvents")}</p>
                )}

                <p className="mt-3 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/80">{t("obs.note")}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/60">
                  {t("obs.retrieved", { date: new Date(weather.retrievedAt).toISOString().slice(0, 10) })}
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
