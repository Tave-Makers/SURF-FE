'use client';

import LoadingCharacter1 from '@surf/ui/assets/loading/character-1.svg';
import LoadingCharacter2 from '@surf/ui/assets/loading/character-2.svg';
import LoadingCharacter3 from '@surf/ui/assets/loading/character-3.svg';
import LoadingCharacter4 from '@surf/ui/assets/loading/character-4.svg';
import LoadingCharacter5 from '@surf/ui/assets/loading/character-5.svg';

import { useOAuthCallback } from '@/features/auth/model/useOAuthCallback';

const characters = [
  LoadingCharacter1,
  LoadingCharacter2,
  LoadingCharacter3,
  LoadingCharacter4,
  LoadingCharacter5,
];

const OAuthCallbackPage = () => {
  useOAuthCallback();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-row items-center" aria-hidden="true">
          {characters.map((Character, i) => (
            <Character
              key={i}
              className="animate-float"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div
          className="text-body-body8 text-foreground-tertiary flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span>잠시만 기다려 주세요</span>
          <span className="animate-dot-appear-1 inline-block" aria-hidden="true">
            .
          </span>
          <span className="animate-dot-appear-2 inline-block" aria-hidden="true">
            .
          </span>
          <span className="animate-dot-appear-3 inline-block" aria-hidden="true">
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
