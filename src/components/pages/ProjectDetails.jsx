// STYLE
import "../../styles/project-details.scss";
import "../../styles/chrono.scss";
// import "../../styles/project-details.scss"

import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chrono } from "react-chrono";
import { host } from "../../api/host.jsx";

//CONTEXT
import UserContext from "../../context/userContext.jsx";
import TriggerContext from "../../context/triggerContext.jsx";

//ELEMENTS
import { TalentCard } from "../elements/TalentCard.jsx";
import Footer from "../elements/Footer.jsx";
import StoneCard from "../elements/StoneCard.jsx";

// ICONS
import { AiOutlineEdit as Edit } from "react-icons/ai";
import { AiOutlinePlus as Plus } from "react-icons/ai";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams("id");
  const [user, setUser] = useContext(UserContext);
  const [trigger, setTrigger] = useContext(TriggerContext);
  const [project, setProject] = useState({});
  const [isPending, setPending] = useState(true);
  const color = user.meta.colorTheme[0];
  const bg = user.meta.colorTheme[1];
  const darkMode = user?.meta?.darkMode;
  const [openStoneCard, setOpenStoneCard] = useState();
  const [stone, setStone] = useState({});
  // const []
  // FETCH CURR PROJECT
  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPending(true);
    const fetchProject = async () => {
      fetch(`${host}/projects/${id}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status) {
            setProject(json.data);
            setPending(false);
          }
        });
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      await fetch(`${host}/users/checklogin`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status) {
            setUser(json.user);
          } else {
            navigate("/login");
          }
        });
    };
    getUser();
  }, [trigger]);
  const seeStoneDetails = (stoneId) => {
    if (openStoneCard === stoneId) {
      setOpenStoneCard("");
    } else {
      setOpenStoneCard(stoneId);
      setStone(project.stoneId);
    }
  };

  return (
    !isPending &&
    user && (
      <div>
        <div className="central col mb1">
          {project.thumbnail && (
            <img src={project.thumbnail} alt="Thumbnail" width="350" />
          )}
          <h1 className={color}>"{project.name}"</h1>
          <h4 className={color}>{project.description}</h4>
        </div>
        {project.team.find((member) => member._id === user._id) && (
          <div className="center">
            <button
              className={`${bg} circle30 central`}
              onClick={() => navigate(`/projectedit/${project._id}`)}
            >
              <h3>
                <Edit />
              </h3>
            </button>
            <p>edit project</p>
          </div>
        )}

        <div className="bo-DARK"></div>
        {project.team.find((member) => member._id === user._id) && (
          <div className="center mt4">
            <button
              className={`${bg} circle70 central`}
              onClick={() => navigate(`/createStone/${project._id}`)}
            >
              <Plus className="fs3" />
            </button>
            <h4 className={color}>create new stone</h4>
          </div>
        )}
        <Chrono
          theme={{
            primary: darkMode ? "#fff" : "#333",
            secondary: darkMode ? "#333" : "#fff",
            cardBgColor: darkMode ? "#333" : "#fff",
            cardForeColor: "violet",
            titleColor: darkMode ? "#fff" : "#333",
            titleColorActive: "red",
          }}
        >
          {!isPending &&
            project.stones.map((stone) => {
              return (
                <div key={stone._id}>
                  {stone.media && <img src={stone.media} alt="" width="150" />}
                  <h1>{stone.title}</h1>
                  {/* <p>{stone.kind}</p> */}
                  {/* <p>{stone.description}</p> */}
                  <div className="mt1 flex g05">
                    {stone?.team?.map((member) => (
                      <div key={member._id} className="circle50 bg-FAV central">
                        <p className="c-A100">{member.profile.initials}</p>
                        {/* )} */}
                      </div>
                    ))}
                  </div>
                  <button
                    className={bg}
                    onClick={() => seeStoneDetails(stone._id)}
                  >
                    {openStoneCard === stone._id ? "close" : "see details"}
                  </button>
                  {openStoneCard === stone._id && (
                    <StoneCard stone={stone} project={project} />
                  )}
                </div>
              );
            })}
          {/* <div className="chrono-icons" id="icons">
            {project?.stones.map((stone) => {
              return (
                (stone.kind === "flintstone" && (
                  <img src="" alt="" key={stone._id} />
                )) ||
                (stone.kind === "stepstone" && (
                  <img
                    src=""
                    alt=""
                    key={stone._id}
                  />
                )) ||
                (stone.kind === "milestone" && (
                  <img src="" alt="" key={stone._id} />
                )) ||
                (stone.kind === "endstone" && (
                  <img src="" alt="" key={stone._id} />
                ))
              );
            })}
          </div> */}
        </Chrono>

        <div className="bo-DARK"></div>
        <div className="center">
          <h4 className={color}>project members</h4>
          <div className="central mt2 g1">
            {project.team.map((member) => (
              <TalentCard key={member._id} talent={member} user={user} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  );
};

export default ProjectDetails;
