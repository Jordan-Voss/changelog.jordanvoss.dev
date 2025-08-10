import React, { useId, useState, useRef, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import clsx from 'clsx';
import { createPopper } from '@popperjs/core';
import styles from './GlossaryTooltip.module.css';

type Props = {
  term: string;
  definition: string;
  link: string; 
  placement?: 'top' | 'bottom';
  bold?: boolean;
};

export default function GlossaryTooltip({ term, definition, link, placement = 'bottom', bold = false }: Props) {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const id = useId();
  const referenceRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const popperInstance = useRef<ReturnType<typeof createPopper> | null>(null);

  useEffect(() => {
    if (referenceRef.current && tooltipRef.current) {
      popperInstance.current = createPopper(referenceRef.current, tooltipRef.current, {
        placement,
        modifiers: [
          { name: 'preventOverflow', options: { padding: 8 } },
          { name: 'flip', options: { fallbackPlacements: ['top', 'bottom'] } }
        ]
      });
    }
    return () => {
      popperInstance.current?.destroy();
    };
  }, [placement]);

  useEffect(() => {
    popperInstance.current?.update();
  }, [open]);

  const goToGlossary = () => {
    const current = window.location.pathname + window.location.hash;
    sessionStorage.setItem('prevAnchor', current);
    history.push(link);
  };

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        className={clsx(styles.termBtn, bold && styles.bold)}
        onClick={goToGlossary}
        ref={referenceRef}
      >
        {term}
      </button>

      <div
        id={id}
        role="tooltip"
        className={clsx(styles.tooltip, open && styles.open)}
        ref={tooltipRef}
      >
        <div className={styles.content}>{definition}</div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={(e) => {
              e.stopPropagation();
              goToGlossary();
            }}
          >
            Read more →
          </button>
        </div>
        <div className={styles.arrow} data-popper-arrow />
      </div>
    </span>
  );
}
