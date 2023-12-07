import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
  const [originData, setOriginData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const genre1 = location.state.genre1;
  const genre2 = location.state.genre2;
  const genre3 = location.state.genre3;
  const singer1 = location.state.singer1;
  const singer2 = location.state.singer2;
  const singer3 = location.state.singer3;
  const diaryList = useContext(DiaryStateContext);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 수정`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );

      if (targetDiary) {
        setOriginData(targetDiary);
      } else {
        alert("없는 일기입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList]);

  return (
    <div>
      {originData && (
        <DiaryEditor
          isEdit={true}
          originData={originData}
          genre1={genre1}
          genre2={genre2}
          genre3={genre3}
          singer1={singer1}
          singer2={singer2}
          singer3={singer3}
        />
      )}
    </div>
  );
};

export default Edit;
