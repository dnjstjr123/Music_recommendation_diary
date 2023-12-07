import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { singerData } from "../util/singers";

const Recommend = () => {
  const navigate = useNavigate();
  const genres = [
    "록/메탈",
    "랩/힙합",
    "댄스",
    "인디음악",
    "포크/블루스",
    "R&B/Soul",
    "발라드",
    "아이돌",
    "재즈",
    "일렉트로니카",
    "OST",
    "EDM",
    "뉴에이지",
    "POP",
    "클래식",
    "J-POP",
    "뮤지컬",
    "CCM",
    "월드뮤직",
  ];
  singerData.sort();
  const selectList1 = genres.map((genre) => ({ value: genre, name: genre }));
  const selectList2 = singerData.map((singer) => ({
    value: singer,
    name: singer,
  }));

  // 추가적으로 "장르 선택"을 넣고 싶다면 아래와 같이 unshift 메서드를 사용할 수 있습니다.
  selectList1.unshift({ value: "default", name: "장르 선택" });
  const [selected1, setSelected1] = useState("장르 선택");
  const [selected2, setSelected2] = useState("장르 선택");
  const [selected3, setSelected3] = useState("장르 선택");

  selectList2.unshift({ value: "default", name: "가수 선택" });
  const [selected4, setSelected4] = useState("가수 선택");
  const [selected5, setSelected5] = useState("가수 선택");
  const [selected6, setSelected6] = useState("가수 선택");

  const handleSelect1 = (e) => {
    setSelected1(e.target.value);
  };
  const handleSelect2 = (e) => {
    setSelected2(e.target.value);
  };
  const handleSelect3 = (e) => {
    setSelected3(e.target.value);
  };

  const handleSelect4 = (e) => {
    setSelected4(e.target.value);
  };
  const handleSelect5 = (e) => {
    setSelected5(e.target.value);
  };
  const handleSelect6 = (e) => {
    setSelected6(e.target.value);
  };
  const handleSelectionComplete = () => {
    localStorage.setItem(
      "selectedGenres",
      JSON.stringify([selected1, selected2, selected3])
    );
    localStorage.setItem(
      "selectedSingers",
      JSON.stringify([selected4, selected5, selected6])
    );

    navigate("/Home", {
      state: {
        genre1: selected1,
        genre2: selected2,
        genre3: selected3,
        singer1: selected4,
        singer2: selected5,
        singer3: selected6,
      },
    });
  };
  return (
    <div className="RecommendPage">
      <div className="mainHeader">
        <div className="head_text">음악 추천 감정 일기장</div>
      </div>
      <div className="Main">
        <img className="mainImage" alt="img_1" src="../assets/main.PNG" />
      </div>
      <div className="RecommendContent">
        <div className="MusicOption">
          좋아하는 음악 장르 세 가지를 선택하세요.
          <br />
          <select
            className="Option1"
            onChange={handleSelect1}
            value={selected1}
          >
            {selectList1.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <br />
          <select
            className="Option2"
            onChange={handleSelect2}
            value={selected2}
          >
            {selectList1.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <br />
          <select
            className="Option3"
            onChange={handleSelect3}
            value={selected3}
          >
            {selectList1.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="SingerOption">
          좋아하는 가수 세 팀을 선택하세요.
          <br />
          <select
            className="Option4"
            onChange={handleSelect4}
            value={selected4}
          >
            {selectList2.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <select
            className="Option5"
            onChange={handleSelect5}
            value={selected5}
          >
            {selectList2.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <select
            className="Option6"
            onChange={handleSelect6}
            value={selected6}
          >
            {selectList2.map((item) => {
              return (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
        <button className="EndBtn" onClick={handleSelectionComplete}>
          {" "}
          선택 완료{" "}
        </button>
      </div>
    </div>
  );
};

export default Recommend;
