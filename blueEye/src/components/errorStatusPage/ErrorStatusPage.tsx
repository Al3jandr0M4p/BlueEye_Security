import React from "react";
import { useNavigate } from "react-router-dom";

type ErrorStatusPageProps = {
  code: "400" | "403" | "404";
  title: string;
  description: string;
  actionLabel: string;
  actionType?: "back" | "home";
};

const ErrorStatusPage: React.FC<ErrorStatusPageProps> = ({
  code,
  title,
  description,
  actionLabel,
  actionType = "back",
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (actionType === "home") {
      navigate("/");
      return;
    }

    navigate(-1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-6 text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col items-center justify-center">
        <section className="relative w-full text-center">
          <div className="pointer-events-none absolute inset-x-0 -top-20 z-0 text-[8rem] font-black leading-none tracking-tight text-slate-200 sm:text-[12rem] md:text-[16rem]">
            {code}
          </div>

          <div className="relative z-10 mx-auto mb-8 mt-8 h-40 w-32 rounded-t-[4rem] border-4 border-slate-300 bg-white shadow-sm sm:h-48 sm:w-40">
            <div className="mx-auto mt-5 h-10 w-10 rounded-full border-4 border-slate-300" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-300" />
            <div className="absolute left-1/2 top-[60%] h-1 w-8 -translate-x-1/2 rounded-full bg-slate-300" />
          </div>

          <h1 className="text-4xl font-extrabold text-indigo-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
            {description}
          </p>

          <button
            type="button"
            onClick={handleAction}
            className="mt-8 rounded-full bg-cyan-500 px-10 py-3 text-sm font-bold text-black transition sm:text-base cursor-pointer"
          >
            {actionLabel}
          </button>
        </section>
      </div>
    </main>
  );
};

export default ErrorStatusPage;
