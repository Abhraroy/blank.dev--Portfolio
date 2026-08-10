import type { Skill } from "./skills.config";

type SkillItemProps = {
  skill: Skill;
};

/** Skill icon with a CSS-only name tooltip. */
export default function SkillItem({ skill }: SkillItemProps) {
  const { name, Icon } = skill;

  return (
    <li className="skill-item relative flex shrink-0 list-none flex-col items-center">
      <button
        type="button"
        className="skill-item__btn flex size-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-50 focus-visible:border-white/25 focus-visible:outline-none sm:size-16"
        aria-label={name}
      >
        <Icon className="size-7 sm:size-8" aria-hidden />
      </button>

      <span className="skill-item__tooltip" role="tooltip">
        {name}
      </span>
    </li>
  );
}
