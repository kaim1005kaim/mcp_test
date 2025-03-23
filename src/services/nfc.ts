import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// NFC初期化
export const initNfc = async (): Promise<boolean> => {
  try {
    await NfcManager.start();
    return await NfcManager.isEnabled();
  } catch (error) {
    console.error('NFC初期化エラー:', error);
    return false;
  }
};

// NFCタグのUID読み取り
export const readNfcTag = async (): Promise<string | null> => {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    return tag?.id || null;
  } catch (error) {
    console.error('NFCタグ読み取りエラー:', error);
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
};

// NFCセッションのクリーンアップ
export const cleanupNfc = () => {
  NfcManager.cancelTechnologyRequest().catch(() => {});
};
