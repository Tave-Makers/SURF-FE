'use client';

type ControlRadioProps = {
  id: string; // input과 label 연결용 고유 ID
  name: string; // 라디오 그룹 이름 (동일 name → 그룹화)
  value: string; // 선택 시 전달되는 값
  label?: string; // 라디오 버튼 옆 텍스트
  checked?: boolean; // 현재 선택 상태 (controlled component)
  disabled?: boolean; // 비활성화 여부
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 핸들러
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
        className="checked:border-background-primary border-border-normal checked:bg-background-primary h-[1.25rem] w-[1.25rem] cursor-pointer appearance-none rounded-full border p-[3.2px] checked:bg-clip-content disabled:cursor-not-allowed"
      />
      <span className="text-border-contrast text-caption-12-400">{label}</span>
    </label>
  );
};
