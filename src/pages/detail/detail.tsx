import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import { View, Text, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import { useLoad } from "@tarojs/taro";

import "./detail.less";

import dianyaDisabled from "../../assets/dianya-disabled.png";
import dianliu from "../../assets/dianya-copy.png";
import gl from "../../assets/gl.png";
import gdy from "../../assets/gdy.png";


import { get as getGlobalData } from "../global_data";

//设备名称
type SettingList = {
  img?: any;
  name: string;
  unit?: string;
  value: string | number;
};

export default function Detail() {

  const [notify, setNotify] = useState<NofityData>({
    battery: 0,
    temperature: 0,
    paper_warn: 0,
    work_status: 0,
  });
  const [connected, setConnected] = useState<string>("已连接");
  const [setting3, setSetting3] = useState<SettingList[]>([]);
  useLoad(() => {
    const globaldata = getGlobalData("notify");
    if (globaldata) {
      setNotify(globaldata);
    }
    const connected = getGlobalData("connected");
    if (connected) {
      setConnected(connected);
    }
    setInterval(() => {
      const globaldata = getGlobalData("notify");
      if (globaldata) {
        setNotify(globaldata);
      }
      const connected = getGlobalData("connected");
      if (connected) {
        setConnected(connected);
      }
    }, 2000);
  });

  useEffect(() => {
    console.log("effect-notify", notify);
    setSetting3(() => {
      return [
        {
          img: dianyaDisabled,
          name: "电量",
          value: notify.battery.toFixed(2),
          unit: "%",
        },
        {
          img: dianliu,
          name: "温度",
          value: notify.temperature,
          unit: "℃",
        },
        {
          img: gl,
          name: "缺纸",
          value: notify.paper_warn==0?"否" : "是",
          unit: "",
        },
        { img: gdy, name: "工作状态", value: notify.work_status, unit: "" },
        { img: gdy, name: "连接状态", value: connected, unit: "" },

      ];
    });
  }, [notify]);

  function toindex() {
    Taro.reLaunch({
      url: "/pages/index/index",
    });
  }

  function toSetting() {
    Taro.navigateTo({
      url: "/pages/parameters/parameters",
    });
  }

  return (
    <View>
      <View className="topHeight"></View>
      <View className="card mt">
        <View className="settinglist">
          {setting3.map((item, i) => (
            <View className=" settingitem" key={i}>
              <Image className="iconimg" src={item.img}></Image>
              <View className="right">
                <View className="value">
                  <Text className="name">{item.value}</Text>
                  <Text className="unit">{item.unit}</Text>
                </View>
                <View className="name">{item.name}</View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="bottom"></View>
    </View>
  );
}
