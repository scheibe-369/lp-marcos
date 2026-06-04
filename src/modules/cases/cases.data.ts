import type { CaseItem } from './cases.types';

/** Rótulo estrutural da seção (mínimo; o Marcos ajusta). */
export const casesTitle = {
  label: 'Trabalhos',
  title: 'Trabalho selecionado.',
};

/** 5 cases placeholder (PRD §4). videoId = PLACEHOLDER até ter os vídeos reais. */
export const cases: CaseItem[] = [
  { slug: 'campanha-verao', client: 'Marca de moda',         project: 'Campanha Verão',    tag: 'Publicidade', thumb: '/images/cases/01.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'bastidores',     client: 'Restaurante',           project: 'Série Bastidores',  tag: 'Conteúdo',    thumb: '/images/cases/02.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'vsl-lancamento', client: 'Infoprodutor',          project: 'VSL de Lançamento', tag: 'Vendas',      thumb: '/images/cases/03.jpg', videoType: 'vimeo',   videoId: 'PLACEHOLDER' },
  { slug: 'aftermovie',     client: 'Produtora de evento',   project: 'Aftermovie',        tag: 'Evento',      thumb: '/images/cases/04.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'reels-serie',    client: 'Criador',               project: 'Série de Reels',    tag: 'Conteúdo',    thumb: '/images/cases/05.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
];
