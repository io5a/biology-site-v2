"use client";

import { Image } from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

export type ImageAlignment = "left" | "center" | "right";

const MIN_IMAGE_WIDTH = 120;
const MAX_IMAGE_WIDTH = 1200;

function parseDimension(value: string | null): number | null {
  if (!value) return null;

  const match = value.match(/\d+(?:\.\d+)?/);
  if (!match) return null;

  const dimension = Number(match[0]);
  return Number.isFinite(dimension) ? Math.round(dimension) : null;
}

function getImageAlignment(value: unknown): ImageAlignment {
  return value === "left" || value === "right" ? value : "center";
}

function ResizableImageView({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const stopResizeRef = useRef<(() => void) | null>(null);
  const align = getImageAlignment(node.attrs.align);
  const width = typeof node.attrs.width === "number" ? node.attrs.width : null;

  useEffect(() => {
    return () => {
      stopResizeRef.current?.();
    };
  }, []);

  function startResize(
    event: ReactPointerEvent<HTMLButtonElement>,
    side: "left" | "right",
  ) {
    event.preventDefault();
    event.stopPropagation();
    stopResizeRef.current?.();

    const initialWidth =
      width ?? imageRef.current?.getBoundingClientRect().width ?? 320;
    const initialX = event.clientX;
    const direction = side === "right" ? 1 : -1;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = (moveEvent.clientX - initialX) * direction;
      const nextWidth = Math.max(
        MIN_IMAGE_WIDTH,
        Math.min(MAX_IMAGE_WIDTH, initialWidth + delta),
      );

      updateAttributes({ width: Math.round(nextWidth) });
    };

    const stopResize = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);

      if (stopResizeRef.current === stopResize) {
        stopResizeRef.current = null;
      }
    };

    stopResizeRef.current = stopResize;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  }

  return (
    <NodeViewWrapper
      className={`article-image-node article-image-node--${align}`}
      data-align={align}
      style={{ width: width ? `${width}px` : undefined }}
    >
      <div className="article-image-frame" data-drag-handle>
        <img
          ref={imageRef}
          src={String(node.attrs.src ?? "")}
          alt={String(node.attrs.alt ?? "")}
          title={node.attrs.title ? String(node.attrs.title) : undefined}
          style={{ width: width ? "100%" : undefined }}
          draggable={false}
        />

        {selected && (
          <>
            <button
              type="button"
              className="article-image-resize-handle article-image-resize-handle--left"
              aria-label="Redimensionează imaginea"
              onPointerDown={(event) => startResize(event, "left")}
            />
            <button
              type="button"
              className="article-image-resize-handle article-image-resize-handle--right"
              aria-label="Redimensionează imaginea"
              onPointerDown={(event) => startResize(event, "right")}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          parseDimension(
            element.getAttribute("data-width") ??
              element.getAttribute("width") ??
              element.style.width,
          ),
        renderHTML: (attributes: { width?: number | null }) =>
          attributes.width
            ? {
                "data-width": String(attributes.width),
                style: `width: ${attributes.width}px`,
              }
            : {},
      },
      align: {
        default: "center",
        parseHTML: (element: HTMLElement) =>
          getImageAlignment(element.getAttribute("data-align")),
        renderHTML: (attributes: { align?: ImageAlignment }) => {
          const align = getImageAlignment(attributes.align);
          return {
            "data-align": align,
            class: `article-image-node--${align}`,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
