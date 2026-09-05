"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EditorContent,
  EditorContext,
  useCurrentEditor,
  useEditor,
  type Editor,
} from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { FindAndReplace } from "@tiptap/extension-find-and-replace";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Button as UiButton } from "@/components/ui/button";
import { ArticlePublishDialog } from "@/components/ui/article-publish-dialog";
import { getErrorMessage } from "@/src/lib/error-message";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { ResizableImage } from "@/components/tiptap-node/image-node/resizable-image-node";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { getPastedImageFiles } from "./simple-editor-utils";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/tiptap-ui/search-and-replace";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
};
const AUTOSAVE_DELAY_MS = 1000;
type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

import { ArticleExtensions } from "./article-schema";
import { Placeholder } from "@tiptap/extensions";

const ImageLayoutControls = () => {
  const { editor } = useCurrentEditor();
  const [isImageSelected, setIsImageSelected] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsImageSelected(false);
      return;
    }

    const updateSelection = () => {
      setIsImageSelected(editor.isActive("image"));
    };

    updateSelection();
    editor.on("selectionUpdate", updateSelection);
    editor.on("transaction", updateSelection);

    return () => {
      editor.off("selectionUpdate", updateSelection);
      editor.off("transaction", updateSelection);
    };
  }, [editor]);

  if (!editor || !isImageSelected) return null;

  const activeAlignment = editor.getAttributes("image").align ?? "center";

  const setAlignment = (align: "left" | "center" | "right") => {
    editor.chain().focus().updateAttributes("image", { align }).run();
  };

  return (
    <>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Aliniere imagine">
        <Button
          type="button"
          variant="ghost"
          tooltip="Aliniază imaginea la stânga"
          aria-label="Aliniază imaginea la stânga"
          aria-pressed={activeAlignment === "left"}
          data-active-state={activeAlignment === "left" ? "on" : "off"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setAlignment("left")}
        >
          <AlignLeft className="tiptap-button-icon" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          tooltip="Centrează imaginea"
          aria-label="Centrează imaginea"
          aria-pressed={activeAlignment === "center"}
          data-active-state={activeAlignment === "center" ? "on" : "off"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setAlignment("center")}
        >
          <AlignCenter className="tiptap-button-icon" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          tooltip="Aliniază imaginea la dreapta"
          aria-label="Aliniază imaginea la dreapta"
          aria-pressed={activeAlignment === "right"}
          data-active-state={activeAlignment === "right" ? "on" : "off"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setAlignment("right")}
        >
          <AlignRight className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>
    </>
  );
};

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  onSearchAndReplaceClick: () => void;
  isSearchAndReplaceOpen: boolean;
  searchAndReplaceButtonRef: React.MutableRefObject<
    HTMLButtonElement | null | undefined
  >;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <ImageLayoutControls />

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <SearchAndReplaceButton
          ref={(element) => {
            searchAndReplaceButtonRef.current = element;
          }}
          aria-expanded={isSearchAndReplaceOpen}
          data-active-state={isSearchAndReplaceOpen ? "on" : "off"}
          onClick={onSearchAndReplaceClick}
        />
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => {
  const { editor } = useCurrentEditor();

  return (
    <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent editor={editor} />
    ) : (
      <LinkContent editor={editor} />
    )}
    </>
  );
};

type SimpleEditorProps = {
  initialContent: JSONContent;
  isEditing: boolean;
  onSaveDraft: (document: JSONContent) => Promise<string | null>;
  onAutoSaveDraft: (document: JSONContent) => Promise<string | null>;
  onPublish: (document: JSONContent) => Promise<string | null>;
  onBack: () => void;
};

export function SimpleEditor({
  initialContent,
  isEditing,
  onSaveDraft,
  onAutoSaveDraft,
  onPublish,
  onBack,
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main",
  );
  const [isSearchAndReplaceOpen, setIsSearchAndReplaceOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const searchAndReplaceButtonRef = useRef<HTMLButtonElement | null>(undefined);
  const editorRef = useRef<Editor | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDocumentRef = useRef<JSONContent | null>(null);
  const saveInFlightRef = useRef(false);
  const saveQueuedRef = useRef(false);

  async function insertPastedImages(files: File[]) {
    const currentEditor = editorRef.current;
    if (!currentEditor) return;

    let selectionBookmark = currentEditor.state.selection.getBookmark();

    for (const file of files) {
      try {
        const src = await handleImageUpload(file);

        if (currentEditor.isDestroyed) return;

        const selection = selectionBookmark.resolve(currentEditor.state.doc);
        currentEditor.view.dispatch(
          currentEditor.state.tr.setSelection(selection),
        );

        const fileName = file.name || "Imagine lipita";
        const inserted = currentEditor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: {
              src,
              alt: fileName,
              title: fileName,
              align: "center",
            },
          })
          .run();

        if (!inserted) {
          throw new Error("Imaginea nu a putut fi inserata.");
        }

        selectionBookmark = currentEditor.state.selection.getBookmark();
      } catch (error) {
        setActionError(getErrorMessage(error, "Imaginea nu a putut fi lipita."));
        return;
      }
    }
  }

  const runAutoSave = useCallback(async () => {
    const document = latestDocumentRef.current;
    if (!document) return;

    if (saveInFlightRef.current) {
      saveQueuedRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    setIsSaving(true);
    setAutoSaveStatus("saving");

    let result: string | null;
    try {
      result = await onAutoSaveDraft(document);
    } catch (error) {
      result = getErrorMessage(error, "Draftul nu a putut fi salvat automat.");
    }

    saveInFlightRef.current = false;
    setIsSaving(false);

    if (result) {
      setActionError(result);
      setAutoSaveStatus("error");
    } else if (latestDocumentRef.current === document) {
      setIsDirty(false);
      setAutoSaveStatus("saved");
    } else {
      setAutoSaveStatus("idle");
    }

    const hasNewerDocument = latestDocumentRef.current !== document;
    const shouldRetry = saveQueuedRef.current || hasNewerDocument;
    saveQueuedRef.current = false;

    if (shouldRetry && latestDocumentRef.current) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveTimerRef.current = null;
        void runAutoSave();
      }, AUTOSAVE_DELAY_MS);
    }
  }, [onAutoSaveDraft]);

  const queueAutoSave = useCallback(
    (document: JSONContent) => {
      latestDocumentRef.current = document;

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveTimerRef.current = null;
        void runAutoSave();
      }, AUTOSAVE_DELAY_MS);
    },
    [runAutoSave],
  );

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
      handlePaste: (view, event) => {
        const currentEditor = editorRef.current;
        const files = getPastedImageFiles(event);

        if (!currentEditor || currentEditor.view !== view || files.length === 0) {
          return false;
        }

        event.preventDefault();
        setActionError(null);
        void insertPastedImages(files);
        return true;
      },
    },
    extensions: [
      StarterKit.configure({
        document: false,
        trailingNode: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      ...ArticleExtensions,
      Placeholder.configure({
        showOnlyCurrent: false,
        includeChildren: true,
        placeholder: ({ node }) => {
          switch (node.type.name) {
            case "articleTitle":
              return "Titlu articol";
            case "articleExcerpt":
              return "Descriere scurta";
            case "articleCategory":
              return "Categorie";
            default:
              return "Incepe sa scrii aici...";
          }
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ResizableImage,
      Typography,
      Superscript,
      Subscript,
      Selection,
      FindAndReplace.configure({
        searchDebounceMs: 500,
        injectCSS: false,
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) =>
          setActionError(getErrorMessage(error, "Imaginea nu a putut fi incarcata.")),
      }),
    ],
    content: initialContent,
  });

  editorRef.current = editor;

  useEffect(() => {
    if (!editor) return;

    const handleEditorUpdate = () => {
      setIsDirty(true);
      setActionError(null);
      setAutoSaveStatus("idle");
      queueAutoSave(editor.getJSON());
    };

    editor.on("update", handleEditorUpdate);
    return () => {
      editor.off("update", handleEditorUpdate);
    };
  }, [editor, queueAutoSave]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const openSearchAndReplace = useCallback(() => {
    setMobileView("main");
    setIsSearchAndReplaceOpen(true);
  }, []);

  const closeSearchAndReplace = useCallback(() => {
    setIsSearchAndReplaceOpen(false);
    searchAndReplaceButtonRef.current?.focus();
  }, []);

  const toggleSearchAndReplace = useCallback(() => {
    if (isSearchAndReplaceOpen) {
      closeSearchAndReplace();
      return;
    }

    openSearchAndReplace();
  }, [closeSearchAndReplace, isSearchAndReplaceOpen, openSearchAndReplace]);

  async function handleSaveDraft() {
    if (!editor || saveInFlightRef.current) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    const document = editor.getJSON();
    latestDocumentRef.current = document;
    saveInFlightRef.current = true;

    setIsSaving(true);
    setActionError(null);
    setAutoSaveStatus("saving");

    let result: string | null;
    try {
      result = await onSaveDraft(document);
    } catch (error) {
      result = getErrorMessage(error, "Draftul nu a putut fi salvat.");
    }

    saveInFlightRef.current = false;
    setIsSaving(false);

    const latestDocument = latestDocumentRef.current ?? document;
    const hasNewerDocument = latestDocument !== document;

    if (result) {
      setActionError(result);
      setAutoSaveStatus("error");
      queueAutoSave(latestDocument);
      return;
    }

    if (hasNewerDocument) {
      setIsDirty(true);
      setAutoSaveStatus("idle");
      queueAutoSave(latestDocument);
      return;
    }

    setIsDirty(false);
    setAutoSaveStatus("saved");
    onBack();
  }

  async function handlePublish(): Promise<string | null> {
    if (!editor || saveInFlightRef.current) return "Actiunea este deja in curs.";

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    saveInFlightRef.current = true;

    setIsSaving(true);
    setActionError(null);
    setAutoSaveStatus("saving");

    let result: string | null;
    try {
      result = await onPublish(editor.getJSON());
    } catch (error) {
      result = getErrorMessage(error, "Articolul nu a putut fi publicat.");
    }

    saveInFlightRef.current = false;
    setIsSaving(false);

    if (result) {
      setActionError(result);
      setAutoSaveStatus("error");
      queueAutoSave(editor.getJSON());
    } else {
      setAutoSaveStatus("saved");
    }

    return result;
  }

  function handleBack() {
    if (
      isDirty &&
      !window.confirm(
        "Ai modificari nesalvate. Doresti sa parasesti editorul fara sa le salvezi?",
      )
    ) {
      return;
    }

    onBack();
  }

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <div className="simple-editor-actions pt-3">
          <div className="simple-editor-actions-start ">
            <UiButton type="button" variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Inapoi
            </UiButton>
            <span
              className="simple-editor-autosave-status"
              data-state={autoSaveStatus}
              role="status"
              aria-live="polite"
            >
              {autoSaveStatus === "saving"
                ? "Salvare automata..."
                : autoSaveStatus === "saved"
                  ? "Salvat automat"
                  : autoSaveStatus === "error"
                    ? "Salvarea automata a esuat"
                    : null}
            </span>
          </div>
          <div className="flex flex-wrap justify-end gap-2 items-center">
            <span className="text-center mr-2 text-sm text-muted-foreground">
                {isEditing ? "Editezi un draft" : "Articol nou"}
              </span>
            <UiButton
              type="button"
              variant="outline"
              onClick={() => void handleSaveDraft()}
              disabled={!editor || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Se salveaza..." : "Salveaza draft"}
            </UiButton>
            <ArticlePublishDialog
              onConfirm={handlePublish}
              trigger={
                <UiButton type="button" disabled={!editor || isSaving}>
                  <Send className="h-4 w-4" />
                  Publica
                </UiButton>
              }
            />
          </div>
        </div>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              onSearchAndReplaceClick={toggleSearchAndReplace}
              isSearchAndReplaceOpen={isSearchAndReplaceOpen}
              searchAndReplaceButtonRef={searchAndReplaceButtonRef}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <SearchAndReplace
          className="simple-editor-search-and-replace"
          open={isSearchAndReplaceOpen}
          onOpen={openSearchAndReplace}
          onClose={closeSearchAndReplace}
          scrollIntoViewOptions={SEARCH_AND_REPLACE_SCROLL_OPTIONS}
        />

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        {actionError && (
          <p className="simple-editor-action-error" role="alert">
            {actionError}
          </p>
        )}
      </EditorContext.Provider>
    </div>
  );
}
