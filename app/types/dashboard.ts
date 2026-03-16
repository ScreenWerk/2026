import type { EntuEntity } from '~/types/entu'

export interface DashboardData {
  screenGroups: EntuEntity[]
  screens: EntuEntity[]
  configs: EntuEntity[]
  schedules: EntuEntity[]
  layouts: EntuEntity[]
  layoutPlaylists: EntuEntity[]
  playlists: EntuEntity[]
  playlistMedias: EntuEntity[]
  medias: EntuEntity[]
  configById: Record<string, EntuEntity>
  layoutById: Record<string, EntuEntity>
  playlistById: Record<string, EntuEntity>
  mediaById: Record<string, EntuEntity>
  screensByGroup: Record<string, EntuEntity[]>
  schedulesByConfig: Record<string, EntuEntity[]>
  layoutPlaylistsByLayout: Record<string, EntuEntity[]>
  playlistMediasByPlaylist: Record<string, EntuEntity[]>
}
