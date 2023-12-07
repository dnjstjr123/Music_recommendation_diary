import { useEffect, useContext, useState } from "react";
import { DiaryStateContext } from "../App";
import { useLocation } from "react-router-dom";
import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";
import DiaryList from "./../components/DiaryList";

const Home = () => {
  const location = useLocation();
  const genre1 = location.state.genre1;
  const genre2 = location.state.genre2;
  const genre3 = location.state.genre3;
  const singer1 = location.state.singer1;
  const singer2 = location.state.singer2;
  const singer3 = location.state.singer3;

  const diaryList = useContext(DiaryStateContext);
  const [data, setData] = useState([]);
  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1} 월`;

  useEffect(() => {
    console.log(genre1, genre2, genre3, singer1, singer2, singer3);
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      );
    }
  }, [diaryList, curDate]);

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList
        diaryList={data}
        genre1={genre1}
        genre2={genre2}
        genre3={genre3}
        singer1={singer1}
        singer2={singer2}
        singer3={singer3}
      />
    </div>
  );
};

export default Home;
