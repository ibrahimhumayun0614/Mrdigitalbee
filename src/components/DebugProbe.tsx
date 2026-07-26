"use client";

import { useEffect } from "react";

export default function DebugProbe() {
  useEffect(() => {
    // #region agent log
    const send = (
      hypothesisId: string,
      message: string,
      data: Record<string, unknown>,
    ) => {
      fetch("http://127.0.0.1:7534/ingest/c22918dd-7bce-4feb-8d8b-1158926eba7a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "4f46ed",
        },
        body: JSON.stringify({
          sessionId: "4f46ed",
          runId: "post-fix",
          hypothesisId,
          location: "DebugProbe.tsx",
          message,
          data,
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    };

    const onError = (event: ErrorEvent) => {
      send("E", "window.error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      send("E", "unhandledrejection", {
        reason: String(event.reason),
      });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const ids = [
      "home",
      "about",
      "services",
      "projects",
      "testimonials",
      "contact",
    ];
    const sections = ids.map((id) => {
      const el = document.getElementById(id);
      return {
        id,
        exists: Boolean(el),
        height: el ? Math.round(el.getBoundingClientRect().height) : 0,
      };
    });
    send("D", "section-anchors", {
      sections,
      runIdTag: "post-fix",
      servicesOk:
        (sections.find((s) => s.id === "services")?.height ?? 0) > 0,
    });

    const logo = document.querySelector(
      'a[href="#home"] img',
    ) as HTMLImageElement | null;
    if (!logo) {
      send("B", "logo-missing-in-dom", {});
    } else {
      const reportLogo = () => {
        send("B", "logo-status", {
          src: logo.currentSrc || logo.src,
          complete: logo.complete,
          naturalWidth: logo.naturalWidth,
          naturalHeight: logo.naturalHeight,
        });
      };
      if (logo.complete) reportLogo();
      else {
        logo.addEventListener("load", reportLogo, { once: true });
        logo.addEventListener(
          "error",
          () => send("B", "logo-error", { src: logo.src }),
          { once: true },
        );
      }
    }

    const contact = document.getElementById("contact");
    send("A", "contact-mount", {
      exists: Boolean(contact),
      height: contact ? Math.round(contact.getBoundingClientRect().height) : 0,
      hasChevronSvg: Boolean(
        contact?.querySelector("svg.lucide-chevron-down, .dropdownChevron"),
      ),
    });

    const scroller = document.querySelector(".scroller");
    send("C", "scrollvelocity-dom", {
      exists: Boolean(scroller),
      childCount: scroller?.childElementCount ?? 0,
      textSample: scroller?.textContent?.slice(0, 80) ?? null,
    });
    // #endregion

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
