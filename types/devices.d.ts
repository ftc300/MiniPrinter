type Devices = {
  RSSI: number;
  advertisData: ArrayBuffer;
  advertisServiceUUIDs: string[];
  connectable: boolean;
  deviceId: string;
  localName: string;
  name: string;
  serviceData: Object;
};

type NofityData = {
  battery: number;
  temperature: number;
  paper_warn: number;
  work_status: number;
  // connect_status: boolean;
};
