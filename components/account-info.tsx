"use client";

import { AccountArticle } from "./ui/account-article";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "./ui/button";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/src/components/ui/skeleton";

export function AccountInfo() {
  const { currentUser, setChangingName, userName } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
  }

  if (!currentUser) {
    return null;
  }
  const userId = currentUser?.id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["articles", userId],
    queryFn: async () =>
      await supabase
        .from("articles")
        .select()
        .eq("author_id", userId)
        .order("created_at", { ascending: false }),
  });
  const articles = data?.data ?? [];
  
  let pfpUrl = `https://hawsggecpatxvgvazfxh.supabase.co/storage/v1/object/public/avatars/${userId}.webp`;
  const {data:pfpExists,isLoading:isLoadingPfp} = useQuery({
    queryKey: ["pfp", userId],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("avatars").exists(`${userId}.webp`);
      return data;
    }
  });
  if(!isLoadingPfp && !pfpExists){
    pfpUrl = `https://hawsggecpatxvgvazfxh.supabase.co/storage/v1/object/public/avatars/default.webp`;
  }

  return (
    <>
      <div className="max-[1200px]:hidden flex h-[calc(100vh-80px)] items-center justify-center p-0 ">
        <div className="flex h-[90%] w-[70%] items-center justify-between rounded-[20px] border bg-[#0E150A] p-7.5">
          <div className="flex h-full w-1/2 flex-col items-center justify-evenly rounded-[20px] bg-[#1a331e] wrap-anywhere">
            <img className="h-75 w-75 rounded-full" src={pfpUrl} />
            <div className="text-[25px] text-center">
              {userName ? `Nume utilizator: ${userName}` : ""}
            </div>
            <div className="text-[25px] text-center">
              Email: {currentUser?.email ?? ""}
            </div>
            <div className="text-[20px] text-center">
              Numarul de articole scrise: {articles.length}
            </div>
            <div className="flex w-full justify-evenly px-5">
              <Button className="lg:text-base text-xs" onClick={logout}>
                Deconectare
              </Button>
              <Button
                className="lg:text-base text-xs"
                onClick={() => setChangingName(true)}
              >
                {userName ? `Schimba Numele` : "Adauga Nume"}
              </Button>
            </div>
          </div>
          <div className="flex h-full w-1/2 flex-col p-5">
            <div className="flex flex-col items-center text-[30px]">
              Articole
            </div>
            <hr className="mt-1.25 border border-[rgb(180,180,180)]" />
            <div className="flex h-full flex-col overflow-scroll p-2.5">
              {articles.map((Article) => {
                return (
                  <AccountArticle
                    key={Article.title ?? ""}
                    slug={Article.slug ?? ""}
                    name={Article.title ?? ""}
                    shortDesc={Article.excerpt ?? ""}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden max-[1200px]:flex h-[calc(100vh-80px)] items-center justify-center p-0 ">
        <div className="flex h-[90%] w-[90%] flex-col items-center justify-between rounded-[20px] border bg-[#0E150A] p-3">
          {!isLoading ?<div className="flex h-1/4 w-full items-center justify-evenly rounded-[20px] bg-[#1a331e] wrap-anywhere p-2">
            <img
              className="aspect-square h-full p-3 rounded-full"
              src={pfpUrl}
            />
            <div className="flex flex-col gap-3 p-3">
              <div className="overflow-scroll h-full w-full">
                <div className="md:text-3xl text-center">
                  {userName ? `Nume utilizator: ${userName}` : ""}
                </div>
                <div className="text-center md:text-3xl">
                  Numarul de articole: {articles.length}
                </div>
              </div>
            </div>
          </div> : (<Skeleton className="w-full h-1/4 mt-4 rounded-2xl px-2"></Skeleton>)}
          {!isLoading ? (articles.length > 0 && (
            <div className="flex h-full flex-col overflow-scroll bg-[#08250d] mt-4 rounded-2xl px-2">
              {articles.map((Article) => {
                return (
                  <AccountArticle
                    key={Article.title ?? ""}
                    slug={Article.slug ?? ""}
                    name={Article.title ?? ""}
                    shortDesc={Article.excerpt ?? ""}
                  />
                );
              })}
            </div>
          )) : (
            <Skeleton className="w-full h-full mt-4 rounded-2xl px-2"></Skeleton>
          )}
          <div className="w-full p-4 md:p-7 bg-[#1a331e] rounded-2xl mt-3">
            <div className="flex w-full h-full justify-evenly items-center">
              <Button className="lg:text-base md:text-2xl md:p-6 text-xs" onClick={logout}>
                Deconectare
              </Button>
              <Button
                className="lg:text-base md:text-2xl md:p-6 text-xs"
                onClick={() => setChangingName(true)}
              >
                {userName ? `Schimba Numele` : "Adauga Nume"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
