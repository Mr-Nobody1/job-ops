import { useSettings } from "@client/hooks/useSettings";
import type { Job } from "@shared/types.js";
import {
  ChevronUp,
  Edit2,
  Loader2,
  RefreshCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { FitAssessment, JobHeader, TailoredSummary } from "..";
import { KbdHint } from "../KbdHint";
import { OpenJobListingButton } from "../OpenJobListingButton";
import { CollapsibleSection } from "./CollapsibleSection";
import { getRenderableJobDescription } from "./helpers";

interface DecideModeProps {
  job: Job;
  onTailor: () => void;
  onSkip: () => void;
  isSkipping: boolean;
  onRescore: () => void;
  isRescoring: boolean;
  onEditDetails: () => void;
  onCheckSponsor?: () => Promise<void>;
}

export const DecideMode: React.FC<DecideModeProps> = ({
  job,
  onTailor,
  onSkip,
  isSkipping,
  onRescore,
  isRescoring,
  onEditDetails,
  onCheckSponsor,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const jobLink = job.applicationLink || job.jobUrl;
  const { renderMarkdownInJobDescriptions } = useSettings();

  const description = useMemo(
    () => getRenderableJobDescription(job.jobDescription),
    [job.jobDescription],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 pb-4">
        <JobHeader job={job} onCheckSponsor={onCheckSponsor} />

        <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
          {jobLink ? (
            <OpenJobListingButton
              href={jobLink}
              className="flex-1 h-11 text-sm sm:h-10 sm:text-xs"
            />
          ) : null}
          <Button
            variant="outline"
            size="default"
            onClick={onSkip}
            disabled={isSkipping}
            className="flex-1 h-11 text-sm text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 sm:h-10 sm:text-xs"
          >
            {isSkipping ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Skip Job
            <KbdHint shortcut="s" className="ml-1.5" />
          </Button>
          <Button
            size="default"
            onClick={onTailor}
            className="flex-1 h-11 text-sm bg-primary/90 hover:bg-primary sm:h-10 sm:text-xs shadow-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Start Tailoring
            <KbdHint shortcut="t" className="ml-1.5" />
          </Button>
        </div>
      </div>

      <Separator className="opacity-40" />

      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        <FitAssessment job={job} />
        <TailoredSummary job={job} />

        <CollapsibleSection
          isOpen={showDescription}
          onToggle={() => setShowDescription((prev) => !prev)}
          label={`${showDescription ? "Hide" : "View"} Full Job Description`}
        >
          <div className="rounded-xl border border-border/40 bg-muted/5 p-4 mt-2 max-h-[400px] overflow-y-auto shadow-inner">
            {renderMarkdownInJobDescriptions ? (
              <div className="text-sm leading-relaxed text-foreground [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-background [&_pre]:p-3 [&_code]:rounded [&_code]:bg-background/80 [&_code]:px-1 [&_code]:py-0.5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-primary [&_a]:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {description}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/90 whitespace-pre-wrap leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </CollapsibleSection>
      </div>

      <Separator className="opacity-40" />

      <div className="pt-4 pb-2 space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 gap-2 text-xs text-muted-foreground hover:text-foreground justify-center"
            >
              More actions
              <ChevronUp className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem onSelect={onEditDetails}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRescore} disabled={isRescoring}>
              <RefreshCcw
                className={
                  isRescoring ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"
                }
              />
              {isRescoring ? "Recalculating..." : "Recalculate match"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
