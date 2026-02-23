import manifest from '../../levels/manifest.json';
import level001 from '../../levels/ch1/level_001.json';
import level002 from '../../levels/ch1/level_002.json';
import level003 from '../../levels/ch1/level_003.json';
import level004 from '../../levels/ch1/level_004.json';
import level005 from '../../levels/ch1/level_005.json';
import level006 from '../../levels/ch1/level_006.json';
import level007 from '../../levels/ch1/level_007.json';
import level008 from '../../levels/ch1/level_008.json';
import level009 from '../../levels/ch1/level_009.json';
import level010 from '../../levels/ch1/level_010.json';
import level011 from '../../levels/ch1/level_011.json';
import level012 from '../../levels/ch1/level_012.json';
import level013 from '../../levels/ch1/level_013.json';
import level014 from '../../levels/ch1/level_014.json';
import level015 from '../../levels/ch1/level_015.json';
import level016 from '../../levels/ch1/level_016.json';
import level017 from '../../levels/ch1/level_017.json';
import level018 from '../../levels/ch1/level_018.json';
import level019 from '../../levels/ch1/level_019.json';
import level020 from '../../levels/ch1/level_020.json';
import { LevelData } from '../engine/types';

export const levels: LevelData[] = [
  level001,level002,level003,level004,level005,level006,level007,level008,level009,level010,
  level011,level012,level013,level014,level015,level016,level017,level018,level019,level020
] as LevelData[];

export const getLevelsByChapter = (): Record<string, LevelData[]> => {
  const grouped: Record<string, LevelData[]> = {};
  levels.forEach((l) => {
    grouped[l.chapterId] = grouped[l.chapterId] ?? [];
    grouped[l.chapterId].push(l);
  });
  return grouped;
};

export const levelManifest = manifest;
