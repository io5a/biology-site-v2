import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

const CATEGORY_OPTIONS = ["Informational", "Activitate"] as const;

export function ArticleCategoryNodeView({ node, updateAttributes }: NodeViewProps) {
  const category = CATEGORY_OPTIONS.includes(node.attrs.value)
    ? node.attrs.value
    : CATEGORY_OPTIONS[0];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, CATEGORY_OPTIONS.indexOf(category)),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  const selectCategory = (value: (typeof CATEGORY_OPTIONS)[number]) => {
    updateAttributes({ value });
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <NodeViewWrapper className="article-category-node" ref={wrapperRef}>
      <button
        type="button"
        className="article-category-trigger"
        ref={triggerRef}
        aria-label="Categoria articolului"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            setActiveIndex(Math.max(0, CATEGORY_OPTIONS.indexOf(category)));
            setIsOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeMenu();
          }
          if (
            !isOpen &&
            ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
          ) {
            event.preventDefault();
            setActiveIndex(Math.max(0, CATEGORY_OPTIONS.indexOf(category)));
            setIsOpen(true);
          }
        }}
      >
        <span className="article-category-dot" aria-hidden="true" />
        <span>{category}</span>
        <span className="article-category-chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="article-category-menu"
          role="listbox"
          aria-label="Categorii articol"
          aria-activedescendant={`article-category-option-${activeIndex}`}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={category === option}
              aria-activedescendant={undefined}
              id={`article-category-option-${CATEGORY_OPTIONS.indexOf(option)}`}
              tabIndex={CATEGORY_OPTIONS.indexOf(option) === activeIndex ? 0 : -1}
              className="article-category-option"
              data-selected={category === option ? "true" : undefined}
              key={option}
              ref={(element) => {
                optionRefs.current[CATEGORY_OPTIONS.indexOf(option)] = element;
              }}
              onKeyDown={(event) => {
                const optionIndex = CATEGORY_OPTIONS.indexOf(option);

                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const direction = event.key === "ArrowDown" ? 1 : -1;
                  setActiveIndex(
                    (optionIndex + direction + CATEGORY_OPTIONS.length) %
                      CATEGORY_OPTIONS.length,
                  );
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  setActiveIndex(event.key === "Home" ? 0 : CATEGORY_OPTIONS.length - 1);
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectCategory(CATEGORY_OPTIONS[activeIndex]);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  closeMenu();
                }
              }}
              onClick={() => selectCategory(option)}
            >
              <span className="article-category-dot" aria-hidden="true" />
              <span>{option}</span>
              {category === option && <span className="article-category-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </NodeViewWrapper>
  );
}
