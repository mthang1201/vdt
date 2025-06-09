import shaka from 'shaka-player';

export default class WishAbrManager extends shaka.abr.SimpleAbrManager {
  constructor() {
    super();
    this.playerInterface = null;
    this.variants = [];
    this.enabled = true;
  }

  init(playerInterface) {
    this.playerInterface = playerInterface;
  }

  setVariants(variants) {
    this.variants = variants;
  }

  chooseVariant() {
    console.log('[WishABR] chooseVariant called', this.variants);

    if (!this.playerInterface) {
      console.warn('[WishABR] playerInterface not set to default variant');
      return this.variants[0];
    }

    if (!this.enabled) {
      console.warn('[WishABR] ABR Manager is disabled.');
      return this.variants[0];
    }

    console.log('[WishABR] ABR Manager is enabled.');

    const estBandwidth = this.bandwidthEstimate; // This is available from the parent class
    const bufferLength = this.playerInterface.getBufferLength
      ? this.playerInterface.getBufferLength()
      : 0;

    const W_q = 1.0;
    const W_b = 1.0;
    const W_d = 1.0;

    const scoredVariants = this.variants.map(variant => {
      const qualityScore = variant.height || 0;
      const dataCost = variant.bandwidth / 1000000; // Mbps
      const bufferRiskCost =
        variant.bandwidth > estBandwidth * 0.8 && bufferLength < 10 ? 10 : 0;

      const score =
        qualityScore * W_q - bufferRiskCost * W_b - dataCost * W_d;

      return { variant, score };
    });

    const bestVariant = scoredVariants.sort((a, b) => b.score - a.score)[0].variant;

    console.log('[WishABR] Choosing variant:', bestVariant);
    return bestVariant;
  }

  segmentDownloaded(deltaTimeMs, numBytes, allowSwitch, request) {
    super.segmentDownloaded(deltaTimeMs, numBytes, allowSwitch, request); // Delegate to parent

    if (allowSwitch && this.playerInterface && this.playerInterface.switch) {
      const newVariant = this.chooseVariant();
      this.playerInterface.switch(newVariant);
    }
  }
}
