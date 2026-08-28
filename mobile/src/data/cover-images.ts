/**
 * Cover image registry.
 * React Native cannot resolve require() from a runtime string, so every cover
 * asset is registered statically here and looked up by its file base name.
 * Generated from assets/covers/*.webp - re-run scripts if covers change.
 */
import type { ImageSourcePropType } from 'react-native';

export const COVER_IMAGES: Record<string, ImageSourcePropType> = {
  "aneurysm_diagram": require('../../assets/covers/aneurysm_diagram.webp'),
  "atlasgiaiphau": require('../../assets/covers/atlasgiaiphau.webp'),
  "baoche": require('../../assets/covers/baoche.webp'),
  "brain_cover": require('../../assets/covers/brain_cover.webp'),
  "capnhatyvan": require('../../assets/covers/capnhatyvan.webp'),
  "chandoanykhoa": require('../../assets/covers/chandoanykhoa.webp'),
  "cohoc": require('../../assets/covers/cohoc.webp'),
  "cothe": require('../../assets/covers/cothe.webp'),
  "digital_health_data": require('../../assets/covers/digital_health_data.webp'),
  "ditruyen": require('../../assets/covers/ditruyen.webp'),
  "ditruyenphantu": require('../../assets/covers/ditruyenphantu.webp'),
  "ditruyentebao": require('../../assets/covers/ditruyentebao.webp'),
  "dongydieuphuong": require('../../assets/covers/dongydieuphuong.webp'),
  "genkhoa": require('../../assets/covers/genkhoa.webp'),
  "giaiphau": require('../../assets/covers/giaiphau.webp'),
  "hospital_corridor": require('../../assets/covers/hospital_corridor.webp'),
  "immunotherapy_lab": require('../../assets/covers/immunotherapy_lab.webp'),
  "kythuatditruyen": require('../../assets/covers/kythuatditruyen.webp'),
  "lamsangnoikhoa": require('../../assets/covers/lamsangnoikhoa.webp'),
  "namduocthanhieu": require('../../assets/covers/namduocthanhieu.webp'),
  "naobo": require('../../assets/covers/naobo.webp'),
  "nhansam": require('../../assets/covers/nhansam.webp'),
  "nuoc_va_su_song": require('../../assets/covers/nuoc_va_su_song.webp'),
  "sinhlythankinh": require('../../assets/covers/sinhlythankinh.webp'),
  "taibienmachmau": require('../../assets/covers/taibienmachmau.webp'),
  "tam_hoc_chua_lanh": require('../../assets/covers/tam_hoc_chua_lanh.webp'),
  "tamly": require('../../assets/covers/tamly.webp'),
  "thankinh": require('../../assets/covers/thankinh.webp'),
  "thaoduoc": require('../../assets/covers/thaoduoc.webp'),
  "thucduong": require('../../assets/covers/thucduong.webp'),
  "trathaomoc": require('../../assets/covers/trathaomoc.webp'),
  "trietly_yhss": require('../../assets/covers/trietly_yhss.webp'),
};

export const FALLBACK_COVER: ImageSourcePropType = require('../../assets/covers/cothe.webp');

/** Resolve a web-style cover path (e.g. "covers/thaoduoc.png") to a bundled asset. */
export function resolveCover(coverPath?: string | null): ImageSourcePropType {
  if (!coverPath) return FALLBACK_COVER;
  const fileName = coverPath.split('/').pop() ?? '';
  const base = fileName.replace(/\.(png|webp|jpg|jpeg)$/i, '');
  return COVER_IMAGES[base] ?? FALLBACK_COVER;
}
