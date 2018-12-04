import { SizeRelatedInfo } from '../types';
import { getNextSizeRelatedInfo } from './utils';

export class Resizer {
  private isDiscarded: boolean = false;

  constructor(private resizeResult: SizeRelatedInfo) {}

  resizeSection(
    indexOfSection: number,
    config: { toSize: number; preferMoveLeftBar?: boolean },
  ): void {
    if (this.isDiscarded) {
      return;
    }

    const sectionID = indexOfSection * 2;
    const currentSize = this.getSize(sectionID);

    if (currentSize >= 0 && config.toSize >= 0) {
      const offset = config.toSize - currentSize;

      if (
        sectionID === this.resizeResult.sizeInfoArray.length - 1 ||
        config.preferMoveLeftBar
      ) {
        this.moveBar(indexOfSection - 1, { withOffset: -offset });
      } else {
        this.moveBar(indexOfSection, { withOffset: offset });
      }
    }
  }

  moveBar(indexOfBar: number, config: { withOffset: number }) {
    if (this.isDiscarded) {
      return;
    }

    this.resizeResult = getNextSizeRelatedInfo(
      indexOfBar * 2 + 1,
      config.withOffset,
      this.resizeResult.sizeInfoArray,
    );
  }

  discard() {
    this.isDiscarded = true;
  }

  getSectionSize(indexOfSection: number) {
    return this.getSize(indexOfSection * 2);
  }

  getResult(): SizeRelatedInfo & { discard: boolean } {
    return { ...this.resizeResult, discard: this.isDiscarded };
  }

  getTotalSize(): number {
    return this.resizeResult.sizeInfoArray
      .filter((sizeInfo, index) => sizeInfo && index % 2 === 0)
      .reduce((total, { currentSize }) => total + currentSize, 0);
  }

  private getSize(index: number): number | -1 {
    const sizeInfo = this.resizeResult.sizeInfoArray[index];
    return sizeInfo ? sizeInfo.currentSize : -1;
  }
}
