import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DiaryStateContext } from "../App";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

import MyHeader from "../components/MyHeader";
import MyButton from "../components/MyButton";
import axios from "axios";

const Diary = () => {
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const location = useLocation();
  const genre1 = location.state.genre1;
  const genre2 = location.state.genre2;
  const genre3 = location.state.genre3;
  const singer1 = location.state.singer1;
  const singer2 = location.state.singer2;
  const singer3 = location.state.singer3;
  const [singer_1, setSinger_1] = useState("");
  const [singer_2, setSinger_2] = useState("");
  const [singer_3, setSinger_3] = useState("");
  const [singer_4, setSinger_4] = useState("");
  const [singer_5, setSinger_5] = useState("");

  const [song_1, setSong_1] = useState("");
  const [song_2, setSong_2] = useState("");
  const [song_3, setSong_3] = useState("");
  const [song_4, setSong_4] = useState("");
  const [song_5, setSong_5] = useState("");
  const [fetchKey, setFetchKey] = useState(0);
  const apiKey = "AIzaSyCu13eIMIbS5pdILaL96T83jDdRYkdo_rc";
  let currentIframe = null;
  const stopVideo = () => {
    if (currentIframe) {
      currentIframe.remove();
    }
  };
  function searchAndPlay(singers, songs) {
    const query = singers + songs + " 가사";

    // YouTube Data API 검색 엔드포인트 URL
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${query}&part=snippet&type=video&key=${apiKey}`;

    // YouTube API 요청
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // 검색 결과 중 첫 번째 동영상의 정보 가져오기
        const video = data.items[0];
        const videoId = video.id.videoId;

        // YouTube 동영상의 오디오 스트림 URL
        const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        // Create an iframe element
        const iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; "; // Optional: Adjust iframe settings
        iframe.style.visibility = "hidden";
        console.log("재생");
        const container = document.getElementById("iframe-container");
        if (container) {
          stopVideo();
          container.appendChild(iframe);
          currentIframe = iframe;
        } else {
          console.error("Container not found");
        }
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("에러가 발생했습니다. 콘솔을 확인하세요.");
      });
  }
  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`;
  }, []);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`;

    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );
      if (targetDiary) {
        // 일기가 존재할 때
        setData(targetDiary);
        console.log(targetDiary.content);
        const fetchData = async () => {
          try {
            // Step 1: Send POST request
            const postResponse = await axios.post(
              "http://localhost:5000/api/send-diary-content",
              {
                content: targetDiary.content,
                genre1: genre1,
                genre2: genre2,
                genre3: genre3,
                singer1: singer1,
                singer2: singer2,
                singer3: singer3,
              }
            );

            console.log(postResponse.data);

            // Step 2: Send GET request after POST is complete
            const getResponse = await axios.get(
              "http://localhost:5000/api/send-diary-content"
            );
            console.log("얻은 정보: ", getResponse.data);
            const informList = JSON.parse(getResponse.data.inform);
            console.log(informList);
            setSinger_1(informList[0].singer);
            setSinger_2(informList[1].singer);
            setSinger_3(informList[2].singer);
            setSinger_4(informList[3].singer);
            setSinger_5(informList[4].singer);
            setSong_1(informList[0].name);
            setSong_2(informList[1].name);
            setSong_3(informList[2].name);
            setSong_4(informList[3].name);
            setSong_5(informList[4].name);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      } else {
        // 일기가 없을 때
        alert("없는 일기입니다.");
        navigate("/Home", { replace: true });
      }
    }
  }, [id, diaryList, fetchKey]);

  if (!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  } else {
    const curEmotionData = emotionList.find(
      (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
    );

    return (
      <div className="DiaryPage">
        <MyHeader
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftChild={
            <MyButton
              text={"< 뒤로가기"}
              onClick={() => {
                setFetchKey((key) => key + 1);
                navigate(-1, {
                  state: {
                    genre1: genre1,
                    genre2: genre2,
                    genre3: genre3,
                    singer1: singer1,
                    singer2: singer2,
                    singer3: singer3,
                  },
                });
              }}
            />
          }
          rightChild={
            <MyButton
              text={"수정하기"}
              onClick={() =>
                navigate(`/edit/${data.id}`, {
                  state: {
                    genre1: genre1,
                    genre2: genre2,
                    genre3: genre3,
                    singer1: singer1,
                    singer2: singer2,
                    singer3: singer3,
                  },
                })
              }
            />
          }
        />
        <article>
          {/* <section>
            <h4>오늘의 감정</h4>
            <div
              className={[
                "diary_img_wrapper",
                `diary_img_wrapper_${data.emotion}`,
              ].join(" ")}
            >
              <img src={curEmotionData.emotion_img} alt="soso" />
              <div className="emotion_descript">
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section> */}
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
          <section>
            <h4>추천하는 음악</h4>
            <div className="song1">
              <img className="img1" alt="img_1" src="../assets/노래1.jpg" />
              <div className="contents">
                <div className="names">
                  <div className="songName"> {song_1} </div>
                  <div className="songSinger"> {singer_1} </div>
                </div>
                <div className="play">
                  <div id="iframe-container" className="container">
                    <img
                      className="playBtn"
                      alt="play"
                      src="../assets/play.png"
                      onClick={() => {
                        searchAndPlay(singer_1, song_1);
                      }}
                    />
                    <img
                      className="stopBtn"
                      alt="stop"
                      src="../assets/stop.png"
                      onClick={stopVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="song2">
              <img className="img2" alt="img_2" src="../assets/노래2.jpg" />
              <div className="contents">
                <div className="names">
                  <div className="songName"> {song_2} </div>
                  <div className="songSinger"> {singer_2} </div>
                </div>
                <div className="play">
                  <div id="iframe-container" className="container">
                    <img
                      className="playBtn"
                      alt="play"
                      src="../assets/play.png"
                      onClick={() => {
                        searchAndPlay(singer_2, song_2);
                      }}
                    />
                    <img
                      className="stopBtn"
                      alt="stop"
                      src="../assets/stop.png"
                      onClick={stopVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="song3">
              <img className="img3" alt="img_3" src="../assets/노래3.jpg" />
              <div className="contents">
                <div className="names">
                  <div className="songName"> {song_3} </div>
                  <div className="songSinger"> {singer_3} </div>
                </div>
                <div className="play">
                  <div id="iframe-container" className="container">
                    <img
                      className="playBtn"
                      alt="play"
                      src="../assets/play.png"
                      onClick={() => {
                        searchAndPlay(singer_3, song_3);
                      }}
                    />
                    <img
                      className="stopBtn"
                      alt="stop"
                      src="../assets/stop.png"
                      onClick={stopVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="song4">
              <img className="img4" alt="img_4" src="../assets/노래4.jpg" />
              <div className="contents">
                <div className="names">
                  <div className="songName"> {song_4} </div>
                  <div className="songSinger"> {singer_4} </div>
                </div>
                <div className="play">
                  <div id="iframe-container" className="container">
                    <img
                      className="playBtn"
                      alt="play"
                      src="../assets/play.png"
                      onClick={() => {
                        searchAndPlay(singer_4, song_4);
                      }}
                    />
                    <img
                      className="stopBtn"
                      alt="stop"
                      src="../assets/stop.png"
                      onClick={stopVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="song5">
              <img className="img5" alt="img_5" src="../assets/노래5.jpg" />
              <div className="contents">
                <div className="names">
                  <div className="songName"> {song_5} </div>
                  <div className="songSinger"> {singer_5} </div>
                </div>
                <div className="play">
                  <div id="iframe-container" className="container">
                    <img
                      className="playBtn"
                      alt="play"
                      src="../assets/play.png"
                      onClick={() => {
                        searchAndPlay(singer_5, song_5);
                      }}
                    />
                    <img
                      className="stopBtn"
                      alt="stop"
                      src="../assets/stop.png"
                      onClick={stopVideo}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    );
  }
};

export default Diary;
