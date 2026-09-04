import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/supabase-client";
import {
  createArticleSlug,
  createEmptyArticleDocument,
  extractArticleMetadata,
  parseArticleDocument,
  serializeArticleContent,
  validateArticleForPublishing,
} from "@/src/lib/article-content";
import type { JSONContent } from "@tiptap/core";
import { getErrorMessage } from "@/src/lib/error-message";

export default function Tiptap() {
  const { articleId } = useParams<{ articleId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? "";
  const draftIdRef = useRef<string | null>(articleId ?? null);
  const draftExistsRef = useRef(Boolean(articleId));

  useEffect(() => {
    draftIdRef.current = articleId ?? null;
    draftExistsRef.current = Boolean(articleId);
  }, [articleId]);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article-editor", articleId, userId],
    enabled: Boolean(articleId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId ?? "")
        .eq("author_id", userId)
        .eq("draft", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (!currentUser) {
    return <Navigate to="/login-page" replace />;
  }

  if (articleId && isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">
        Se incarca articolul...
      </div>
    );
  }

  if (articleId && !article) {
    return <Navigate to="/login-page" replace />;
  }

  const initialContent =
    parseArticleDocument(article?.content ?? null) ?? createEmptyArticleDocument();

  async function persistDraft(document: JSONContent): Promise<string | null> {
    const id = draftIdRef.current ?? crypto.randomUUID();
    draftIdRef.current = id;
    const metadata = extractArticleMetadata(document);
    const payload = {
      id,
      author_id: userId,
      title: metadata.title || null,
      excerpt: metadata.excerpt || null,
      category: metadata.category || null,
      content: serializeArticleContent(document),
      draft: true,
      slug: article?.slug ?? null,
    };

    try {
      if (draftExistsRef.current) {
        const { data, error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", id)
          .eq("author_id", userId)
          .eq("draft", true)
          .select("id")
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Draftul nu mai este disponibil pentru editare.");
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
        draftExistsRef.current = true;
      }

      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async function saveDraft(document: JSONContent): Promise<string | null> {
    const result = await persistDraft(document);
    if (result) return result;

    await queryClient.invalidateQueries({ queryKey: ["articles", userId] });
    navigate("/login-page");
    return null;
  }

  async function autoSaveDraft(document: JSONContent): Promise<string | null> {
    return persistDraft(document);
  }

  async function publishArticle(document: JSONContent): Promise<string | null> {
    const validationError = validateArticleForPublishing(document);
    if (validationError) return validationError;

    const id = draftIdRef.current ?? crypto.randomUUID();
    draftIdRef.current = id;
    const metadata = extractArticleMetadata(document);
    const payload = {
      id,
      author_id: userId,
      title: metadata.title,
      excerpt: metadata.excerpt,
      category: metadata.category,
      content: serializeArticleContent(document),
      draft: false,
      slug: createArticleSlug(metadata.title, id),
    };

    try {
      if (draftExistsRef.current) {
        const { data, error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", id)
          .eq("author_id", userId)
          .eq("draft", true)
          .select("id")
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Articolul nu mai este disponibil pentru publicare.");
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
        draftExistsRef.current = true;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["articles", userId] }),
        queryClient.invalidateQueries({ queryKey: ["articles"] }),
        queryClient.invalidateQueries({ queryKey: ["home-articles"] }),
      ]);
      navigate("/login-page");
      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  return (
    <SimpleEditor
      key={articleId ?? "new"}
      initialContent={initialContent}
      isEditing={Boolean(articleId)}
      onSaveDraft={saveDraft}
      onAutoSaveDraft={autoSaveDraft}
      onPublish={publishArticle}
      onBack={() => navigate("/login-page")}
    />
  );
}