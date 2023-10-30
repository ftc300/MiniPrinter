import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import React, { useState } from "react";
import { strToData } from "../..//util/util";

import "./devicesList.less";
import blueTooth from "../../assets/bluetooth.png";
import blueTooth1 from "../../assets/bluetooth1.png";

import dianyaDisabled from "../../assets/dianya-disabled.png";
import dianliu from "../../assets/dianya-copy.png";
import dianchi from "../../assets/dianchi.png";
import wendu from "../../assets/wendu.png";

import { set as setGlobalData } from "../global_data";

type DevicesProps = {
  devicesData: Devices;
  stopBluetoothDevicesDiscovery: Function;
};

const DevicesList: React.FC<DevicesProps> = (props) => {
  const [state, setState] = useState<string>("未连接"); // 连接状态
  const { devicesData, stopBluetoothDevicesDiscovery } = props;
  const deviceId: string = devicesData.deviceId;

  function toDetail() {
    // 停止搜索
    stopBluetoothDevicesDiscovery();
    var encodedData = encodeURI(JSON.stringify(devicesData));

    if (state == "已连接") {
      Taro.navigateTo({
        url: `/pages/detail/detail?devicesData=${encodedData} `,
      });
      return;
    }
    Taro.showLoading({
      title: "开始连接",
    });

    Taro.createBLEConnection({
      deviceId,
      success: () => {
        Taro.showToast({
          title: "连接成功",
          icon: "success",
          duration: 3000,
        });
        setTimeout(() => {
          Taro.setBLEMTU({
            deviceId,
            mtu: 512,
            success: () => {
              Taro.showToast({
                title: "mtu 设置成功",
                icon: "success",
                duration: 3000,
              });
            },
          });
        }, 500);

        onBleConnectState(); //监听蓝牙连接状态
        getBLEDeviceServices(deviceId); //获取蓝牙设备所有 service（服务）
        setState("已连接");
        setGlobalData("connected", "已连接");
        stopBluetoothDevicesDiscovery();
      },
      fail: function (res) {
        console.log("连接蓝牙设备失败", res);
        Taro.showToast({
          title: "连接蓝牙设备失败",
          icon: "error",
          duration: 2000,
        });
      },
      complete() {
        Taro.hideLoading();
      },
    });
  }
  // 断开连接显示
  function onBleConnectState() {
    //监听蓝牙连接状态
    Taro.onBLEConnectionStateChange(function (res) {
      if (!res.connected) {
        setState("未连接");
        setGlobalData("connected", "未连接");
      }
    });
  }

  function getBLEDeviceServices(id: string) {
    Taro.getBLEDeviceServices({
      deviceId: id,
      success: function (res) {
        console.log("device services:", res.services);
        const svc = res.services?.find(it=>{ return it.uuid.toLowerCase() === "4fafc201-1fb5-459e-8fcc-c5c9c331914b"});
        if(svc){
          getBLEDeviceCharacteristics(deviceId, svc.uuid);
        }
      },
    });
  }
  /**蓝牙设备characteristic(特征值)信息 */
  function getBLEDeviceCharacteristics(id: string, sid: string) {
    Taro.getBLEDeviceCharacteristics({
      deviceId: id,
      serviceId: sid,
      success: function (res) {
        const characteristics = res.characteristics;
        console.log("device characteristics:",characteristics);
        const characteristic = characteristics.find(it=>{ return it.uuid.toLowerCase() === "beb5483e-36e1-4688-b7f5-ea07361b26a8"});
        if(!characteristic) return
        Taro.notifyBLECharacteristicValueChange({
          state: true, // 启用 notify 功能
          deviceId: id,
          serviceId: sid,
          characteristicId: characteristic.uuid,
          success: function (res) {
            console.log("notify success", res);
            Taro.onBLECharacteristicValueChange(function (res) {
              const arrayBuffer = res.value;
              // 将 ArrayBuffer 转换为 Uint8Array
              const uint8Array = new Uint8Array(arrayBuffer);
              console.log("数据", byteArr2HexString(uint8Array,","));

              console.log("data", uint8Array[0]+","+uint8Array[1]+","+uint8Array[2]+","+uint8Array[3]);
              // console.log("数据", JSON.parse(resultString));

              setGlobalData("notify", {
                battery:uint8Array[0],
                temperature: uint8Array[1],
                paper_warn: uint8Array[2],
                work_status: uint8Array[3]
                // connect_status: false,
              });
            });
          },
        });
      },
    });
  }

  function byteArr2HexString(data: Uint8Array | null, split: string): string {
    if (data === null) return "null";
    let hexString = "";
    for (const d of data) {
      const hex = (d & 0xFF).toString(16).toUpperCase().padStart(2, "0");
      hexString += hex + split;
    }
    return hexString.substring(0, hexString.length - 1);
  }
  return (
    <View className="card" onClick={toDetail}>
        <View>
          <Text className="device">
            {devicesData.name == "" ? devicesData.deviceId : devicesData.name}(
            {state})
          </Text>
        </View>
    </View>
  );
};

export default DevicesList;
