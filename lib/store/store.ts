import { create } from 'zustand'
import { ProjectCollection, ProjectFiles } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface ProjectStore {
  projects: ProjectCollection
  currentProjectId: string | null
  addProject: (projectName: string, projectFiles: ProjectFiles) => void
  deleteProject: (projectId: string) => void
  setCurrentProjectId: (projectId: string | null) => void
  addFile: (
    projectId: string,
    fileType: keyof ProjectFiles,
    file: string
  ) => void
  deleteFile: (
    projectId: string,
    fileType: keyof ProjectFiles,
    fileName: string
  ) => void
}

export const useProjectStore = create<ProjectStore>(set => ({
  projects: {},
  currentProjectId: null,
  addProject: (projectName, projectFiles) => {
    const projectId = uuidv4() // Generate a unique ID for the project
    set(state => ({
      projects: {
        ...state.projects,
        [projectId]: { projectId, projectName, files: projectFiles }
      },
      currentProjectId: projectId // Optionally set the new project as the current one
    }))
  },
  deleteProject: projectId =>
    set(state => {
      const { [projectId]: deletedProject, ...remainingProjects } =
        state.projects
      return {
        projects: remainingProjects,
        currentProjectId:
          state.currentProjectId === projectId ? null : state.currentProjectId
      }
    }),
  setCurrentProjectId: projectId =>
    set(() => ({
      currentProjectId: projectId
    })),
  addFile: (projectId, fileType, file) =>
    set(state => ({
      projects: {
        ...state.projects,
        [projectId]: {
          ...state.projects[projectId],
          files: {
            ...state.projects[projectId].files,
            [fileType]: [...state.projects[projectId].files[fileType], file]
          }
        }
      }
    })),
  deleteFile: (projectId, fileType, fileName) =>
    set(state => ({
      projects: {
        ...state.projects,
        [projectId]: {
          ...state.projects[projectId],
          files: {
            ...state.projects[projectId].files,
            [fileType]: state.projects[projectId].files[fileType].filter(
              file => file !== fileName
            )
          }
        }
      }
    }))
}))
