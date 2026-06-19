export type VideoType = 'youtube' | 'vimeo' | 'mp4';

export interface CaseItem {
  slug: string;
  client: string; // etiqueta de cima (nome do cliente/empresa)
  project: string; // nome do projeto, em Space Grotesk no hover
  tag: string; // "Publicidade" | "Conteúdo" | "Vendas" | "Evento" ...
  thumb: string; // /images/cases/xxx.jpg (RETRATO ~3:4)
  videoType: VideoType;
  videoId: string; // id do youtube/vimeo OU caminho do mp4
}
