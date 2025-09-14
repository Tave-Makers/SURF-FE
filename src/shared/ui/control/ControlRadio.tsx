'use client';

type ControlRadioProps = {
  id: string;
  name: string;
  value: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ControlRadio: React.FC<ControlRadioProps> = ({
  id,
  name,
  value,
  label,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer items-center gap-[0.625rem] ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer checked:border-background-primary border-border-normal checked:bg-background-primary h-[1.25rem] w-[1.25rem] cursor-pointer appearance-none rounded-full border p-[3.2px] checked:bg-clip-content disabled:cursor-not-allowed"
      />
      <span className="text-border-contrast text-caption-12-400">{label}</span>
    </label>
  );
};
