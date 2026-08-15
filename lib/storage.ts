import type { RoadmapResponse } from "./schemas";

const STORAGE_KEYS = {
  ACTIVE_ROADMAP: "pathpilot_active_roadmap_v1",
  COMPLETED_TASKS: "pathpilot_completed_tasks_v1",
  SAVED_ROADMAPS: "pathpilot_saved_roadmaps_v1",
};

/**
 * Safely retrieves completed task IDs for a specific roadmap from localStorage.
 */
export function getStoredCompletedTasks(roadmapId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.COMPLETED_TASKS}_${roadmapId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Failed to load completed tasks from localStorage:", error);
    return [];
  }
}

/**
 * Safely persists completed task IDs for a specific roadmap to localStorage.
 */
export function saveStoredCompletedTasks(roadmapId: string, taskIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.COMPLETED_TASKS}_${roadmapId}`,
      JSON.stringify(taskIds)
    );
  } catch (error) {
    console.warn("Failed to save completed tasks to localStorage:", error);
  }
}

/**
 * Safely retrieves the currently active roadmap from localStorage.
 */
export function getStoredActiveRoadmap(): RoadmapResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROADMAP);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to load active roadmap from localStorage:", error);
    return null;
  }
}

/**
 * Safely persists the currently active roadmap to localStorage.
 */
export function saveStoredActiveRoadmap(roadmap: RoadmapResponse | null): void {
  if (typeof window === "undefined") return;
  try {
    if (roadmap) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));
      // Also add to saved roadmaps list
      addStoredSavedRoadmap(roadmap);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROADMAP);
    }
  } catch (error) {
    console.warn("Failed to save active roadmap to localStorage:", error);
  }
}

/**
 * Saves a roadmap into the list of historical generated roadmaps (capped at last 10).
 */
export function addStoredSavedRoadmap(roadmap: RoadmapResponse): void {
  if (typeof window === "undefined") return;
  try {
    const listRaw = localStorage.getItem(STORAGE_KEYS.SAVED_ROADMAPS);
    let list: RoadmapResponse[] = listRaw ? JSON.parse(listRaw) : [];
    list = [roadmap, ...list.filter((r) => r.id !== roadmap.id)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SAVED_ROADMAPS, JSON.stringify(list));
  } catch (error) {
    console.warn("Failed to add roadmap to history in localStorage:", error);
  }
}

/**
 * Retrieves the history of saved roadmaps from localStorage.
 */
export function getStoredSavedRoadmaps(): RoadmapResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ROADMAPS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Failed to load saved roadmaps from localStorage:", error);
    return [];
  }
}
