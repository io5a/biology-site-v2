import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { Navigation } from "@/components/navigation";
import HomePage from "@/src/pages/HomePage";
import ArticlesPage from "@/src/pages/ArticlesPage";
import ArticleDetailPage from "@/src/pages/ArticleDetailPage";
import AnnouncementsPage from "@/src/pages/AnnouncementsPage";
import LearningPage from "@/src/pages/LearningPage";
import CompetitionsPage from "@/src/pages/CompetitionsPage";
import GalleryPage from "@/src/pages/GalleryPage";
import LoginPage from "@/src/pages/LoginPage";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Tiptap from "./Tiptap";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Navigation />
            <Routes >
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/login-page" element={<LoginPage />} />
              <Route path="/editor" element={<Tiptap />} />
          </Routes>
        </AuthProvider>
        <SpeedInsights/>
        <Analytics />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
