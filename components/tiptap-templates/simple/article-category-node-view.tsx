import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

const CATEGORY_OPTIONS = ["Informational", "Activitate"] as const;

export function ArticleCategoryNodeView({ node, updateAttributes }: NodeViewProps) {
  const category = CATEGORY_OPTIONS.includes(node.attrs.value)
    ? node.attrs.value
    : CATEGORY_OPTIONS[0];
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
  };

  return (
    <NodeViewWrapper className="article-category-node" ref={wrapperRef}>
      <button
        type="button"
        className="article-category-trigger"
        aria-label="Categoria articolului"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className="article-category-dot" aria-hidden="true" />
        <span>{category}</span>
        <span className="article-category-chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="article-category-menu" role="listbox" aria-label="Categorii articol">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={category === option}
              className="article-category-option"
              data-selected={category === option ? "true" : undefined}
              key={option}
              onMouseDown={(event) => event.preventDefault()}
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
