"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JobEmail, JobStatus, KANBAN_COLUMNS } from "@/types";
import { JobCard } from "./JobCard";
import { AlertTriangle, Clock, Briefcase, TrendingUp } from "lucide-react";

interface KanbanBoardProps {
  jobs: JobEmail[];
  onJobsChange: (jobs: JobEmail[]) => void;
  onGenerateFollowUp: (job: JobEmail) => void;
  onOpenPrepModal: (job: JobEmail) => void;
}

interface SortableJobCardProps {
  job: JobEmail;
  onGenerateFollowUp: (job: JobEmail) => void;
  onOpenPrepModal: (job: JobEmail) => void;
}

function SortableJobCard({
  job,
  onGenerateFollowUp,
  onOpenPrepModal,
}: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard
        job={job}
        onGenerateFollowUp={onGenerateFollowUp}
        onOpenPrepModal={onOpenPrepModal}
        isDragging={false}
      />
    </div>
  );
}

function DroppableColumn({
  columnId,
  label,
  bgColor,
  borderColor,
  textColor,
  countColor,
  jobs,
  onGenerateFollowUp,
  onOpenPrepModal,
}: {
  columnId: JobStatus;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  countColor: string;
  jobs: JobEmail[];
  onGenerateFollowUp: (job: JobEmail) => void;
  onOpenPrepModal: (job: JobEmail) => void;
}) {
  const fraudCount = jobs.filter((j) => j.is_fraud).length;
  const followUpCount = jobs.filter((j) => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(j.date_received).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return j.status === "Applied" && daysAgo > 7 && !j.is_fraud;
  }).length;

  return (
    <div
      className={`flex flex-col rounded-xl border ${borderColor} ${bgColor} min-h-[500px]`}
    >
      {/* Column Header */}
      <div
        className={`px-4 py-3 border-b ${borderColor} flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <h3 className={`font-bold text-sm ${textColor}`}>{label}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${countColor}`}
          >
            {jobs.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Fraud count in column — solid red border badge */}
          {fraudCount > 0 && (
            <span className="flex items-center gap-1 text-red-600 text-xs bg-red-50 border-2 border-red-500 px-2 py-0.5 rounded-full font-bold">
              <AlertTriangle className="w-3 h-3" />
              {fraudCount}
            </span>
          )}
          {followUpCount > 0 && (
            <span className="flex items-center gap-1 text-surface-500 text-xs bg-surface-200 border border-surface-300 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {followUpCount}
            </span>
          )}
        </div>
      </div>

      {/* Card List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-surface-300">
              <Briefcase className="w-8 h-8 mb-2" />
              <p className="text-sm">No applications</p>
            </div>
          ) : (
            jobs.map((job) => (
              <SortableJobCard
                key={job.id}
                job={job}
                onGenerateFollowUp={onGenerateFollowUp}
                onOpenPrepModal={onOpenPrepModal}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export function KanbanBoard({
  jobs,
  onJobsChange,
  onGenerateFollowUp,
  onOpenPrepModal,
}: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<JobEmail | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getJobsByStatus = (status: JobStatus) =>
    jobs.filter((j) => j.status === status);

  function handleDragStart(event: DragStartEvent) {
    const job = jobs.find((j) => j.id === event.active.id);
    setActiveJob(job || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveJob(null);
    const { active, over } = event;
    if (!over) return;

    const activeJobId = active.id as string;
    const overId = over.id as string;

    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
    const targetJob = jobs.find((j) => j.id === overId);
    const targetStatus = targetColumn?.id || targetJob?.status;

    if (!targetStatus) return;

    const updatedJobs = jobs.map((job) =>
      job.id === activeJobId
        ? { ...job, status: targetStatus as JobStatus }
        : job
    );
    onJobsChange(updatedJobs);
  }

  const totalFraud = jobs.filter((j) => j.is_fraud).length;
  const totalFollowUp = jobs.filter((j) => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(j.date_received).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return j.status === "Applied" && daysAgo > 7 && !j.is_fraud;
  }).length;
  const offerCount = jobs.filter((j) => j.status === "Offer").length;

  return (
    <div className="w-full">
      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-surface-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-surface-500" />
          </div>
          <div>
            <p className="text-surface-400 text-xs">Total</p>
            <p className="text-surface-900 font-bold text-lg leading-tight">
              {jobs.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-surface-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-900 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-surface-400 text-xs">Offers</p>
            <p className="text-surface-900 font-bold text-lg leading-tight">
              {offerCount}
            </p>
          </div>
        </div>

        <div className="bg-white border border-surface-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-surface-500" />
          </div>
          <div>
            <p className="text-surface-400 text-xs">Follow-Ups Due</p>
            <p className="text-surface-700 font-bold text-lg leading-tight">
              {totalFollowUp}
            </p>
          </div>
        </div>

        {/* Fraud stat — red accent maintained for safety */}
        <div className="bg-white border-2 border-red-500 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-red-400 text-xs">Fraud Alerts</p>
            <p className="text-red-600 font-bold text-lg leading-tight">
              {totalFraud}
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((col) => (
            <DroppableColumn
              key={col.id}
              columnId={col.id}
              label={col.label}
              bgColor={col.bgColor}
              borderColor={col.borderColor}
              textColor={col.textColor}
              countColor={col.countColor}
              jobs={getJobsByStatus(col.id)}
              onGenerateFollowUp={onGenerateFollowUp}
              onOpenPrepModal={onOpenPrepModal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeJob && (
            <div className="rotate-2 scale-105 opacity-90 shadow-xl">
              <JobCard
                job={activeJob}
                onGenerateFollowUp={onGenerateFollowUp}
                onOpenPrepModal={onOpenPrepModal}
                isDragging={true}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
