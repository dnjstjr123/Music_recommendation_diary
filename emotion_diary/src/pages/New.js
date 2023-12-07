import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DiaryEditor from "../components/DiaryEditor";

const New = () => {
  const location = useLocation();
  const genre1 = location.state.genre1;
  const genre2 = location.state.genre2;
  const genre3 = location.state.genre3;
  const singer1 = location.state.singer1;
  const singer2 = location.state.singer2;
  const singer3 = location.state.singer3;
  useEffect(() => {
    console.log(genre1, genre2, genre3, singer1, singer2, singer3);
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - 새 일기`;
  }, []);

  return (
    <div>
      <DiaryEditor
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

export default New;
