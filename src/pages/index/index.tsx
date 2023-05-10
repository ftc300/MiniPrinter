import { View, Text, Image } from "@tarojs/components";
import DevicesList from "../components/devicesList";
import { useLoad } from "@tarojs/taro";
import "./index.less";
/* assets */
// 引用文件
import namedPng from "../../assets/header.png";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <View className="title">
        <Text className="hi">Hi~ !</Text>
        <View>
          <Text className="welcome">欢迎使用菠萝储能BMS</Text>
        </View>
      </View>
      <Image className="headerimg" src={namedPng}></Image>
      <DevicesList />
    </View>
  );
}
