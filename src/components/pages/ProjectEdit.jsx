import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { host } from "../../api/host.jsx"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../../context/userContext.jsx";

// COMPONENTS
import CategoriesFilter from "../elements/CategoriesFilter.jsx";
import RadioPrivacy from "../buttons/RadioPrivacy"
import Footer from "../elements/Footer.jsx";
import { RadioProjectColor } from "../buttons/RadioColor.jsx";
import { TalentToProjectCard } from "../elements/TalentToProjectCard.jsx";

// ICONS
import { AiOutlineCamera as Camera} from "react-icons/ai"


const CreateProject = () => {
  const { id } = useParams("id");
  const navigate = useNavigate();
  const [project, setProject] = useState(undefined)
  const [eMailFields, setEmailFields] = useState([1]);
  const [user, setUser] = useContext(UserContext)
  const initial = {userId: user._id}
  const [thumbnail, setThumbnail] = useState(undefined)
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [projectColor, setProjectColor] = useState("orange")
  const [category, setCategory] = useState(undefined)
  const [privacy, setPrivacy] = useState(false)
  const [newProject, setNewProject] = useState(project)
  const [talents, setTalents] = useState([])
  const [isPending, setPending] = useState(false)
  const [uploadPending, setUploadPending] = useState(false);
  const [createProjectPending, setCreateProjectPending] = useState(false);
  const [team, setTeam] = useState([])
  const [inviteEmail, setInviteEmail] = useState([]);
  const follows = user.follows;
  const [addUserToTeamTrigger, setAddUserToTeamTrigger] = useState(false);

  const noFollowsFilter = (arr1, arr2) => {
    let clean = [];
    clean = arr1.filter(el => {
      return !arr2.some(element => {
          return element._id === el._id;
      });
    });
    return clean;
  }
  const noFollows = noFollowsFilter(talents, follows)

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    theme: "dark",
  };

  // FETCH CURR PROJECT
  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; 
    setPending(true)
    const fetchProject = async () => {
      fetch(`${host}/projects/${id}`,{
        credentials:"include"
      })        
        .then((response) => response.json())
        .then((json) => {
          if(json.status){
            setProject(json.data)
            setPending(false)
          }
        });
    }
    fetchProject()
  },[id])

  // INPUT HANDLER START //
  const handleInput = (event) => {
    setNewProject({ ...newProject, [event.target.name]: event.target.value });
  }

  const handleFile = (event) => {
    setThumbnail(event.target.files[0])
    const image = URL.createObjectURL(event.target.files[0])
    setThumbnailUrl(image);
  }

  // HANDLE THE AMOUNTS OF INVITE INPUT FIELDS START //
  const addEmailFields = (event) => {
    event.preventDefault();
    setEmailFields([...eMailFields, 1])
  }

  const subEmailFields = (event) => {
    event.preventDefault();
    setEmailFields([...eMailFields.slice(0,-1)])
  }
  // HANDLE THE AMOUNTS OF INVITE INPUT FIELDS START //

  const inviteInputHandler = (event) => {
    setInviteEmail({...inviteEmail, [event.target.name]: event.target.value})
  }
  // INPUT HANDLER END //

  // USE EFFECTS START //
  useEffect(() => {
    setNewProject({...newProject, color: projectColor});
  }, [projectColor])

  useEffect(() => {
    setNewProject({...newProject, category: category});
  }, [category])

  useEffect(() => {
    setNewProject({...newProject, team: team});
  }, [team])

  useEffect(() => {
    setTeam([...team, user._id])
    setNewProject({...newProject, team: team});
  }, [addUserToTeamTrigger])

  // NOT WORKING
  useEffect(() => {
    setNewProject({...newProject, inviteOthers: Object.values(inviteEmail)});
  }, [inviteEmail])

  useEffect(() => {
    setNewProject({...newProject, private: privacy});
  }, [privacy])

  // USE EFFECTS END //

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAddUserToTeamTrigger(true);

    // Add your own userId to the team, because your a member of the project too.
    console.log('Z 122, newProject: ', newProject)

    const formData = new FormData()
    formData.append('thumbnail', thumbnail)
    formData.append('data', JSON.stringify(newProject))


    const sendProjectData = async () => {
      setUploadPending(true)
      await fetch(`${host}/projects/add`, 
      {
        credentials: "include",
        method: 'POST',
        body: formData,
        // body: JSON.stringify(newProject),
      })
        .then((json) => json.json())
        .then((data) => {
          if (data.status) {
            toast.info("Your project is save!", toastOptions);
            setAddUserToTeamTrigger(false);
            setUploadPending(false);
            if(!createProjectPending) {
              location.reload()
            }
          } 
          if (data.error) {
            toast.error(data.error, toastOptions);            
          }
        });
    };
    sendProjectData();
  }

  return uploadPending ? <div>Loading...</div> :
  
  project && (
    <>
      <div className="mt4 mb2">
        <h1 className="central c-FAV">new project</h1>
        <h4 className="central c-FAV mt05">It is time to amaze the world!</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="central col pa1 mb2">
          <div className="col">
            <p>project name<span className="c-FAV">*</span></p>
            <input
              type="text"
              name="name"
              placeholder={project.name}
              required
              onChange={handleInput}
            />
          </div>

          <div className="col">
            <p>description<span className="c-FAV">*</span></p>
            <input
              type="text"
              name="description"
              placeholder={project.description}
              required
              onChange={handleInput}
            />
          </div>

          <div className="col">
            <p>thumbnail</p>
            {/* <div className="thumbnailS"> */}
              {thumbnailUrl 
              ?
              <img 
                  src={thumbnailUrl} 
                  alt="thumbnail"                 
              />
              :
              project.thumbnail ?
                <img 
                  src={project.thumbnail} 
                  alt="thumbnail"                 
                />
                : 
                <div className="central">PLATZHALTER</div>              
              }
              <div title="upload"><Camera /></div>
            {/* </div> */}
            <input
              type="file"
              name="thumbnail"
              onChange={handleFile}
              accept=".jpeg, .jpg, .png, .gif, .tiff, .bmp"
            />
          </div>
          <div className="col">
            <p>Current category:<span className="c-FAV">*</span></p>
            <p>{project.category}</p>
          </div>
          <div className="col">
            <p>Choose here to change the category:</p>
            <CategoriesFilter setCategory={setCategory} category={category}/>
          </div>
          <div className="col">
            <p>change your project color:</p>
            <RadioProjectColor setProjectColor={setProjectColor} />
          </div>
        </div>

        <div className="col">
            TIMELINE & STONES 
        </div>

    {/*  - - - - - FOLLOWING COMMUNITY - - - - - */}
    <div className="bo-DARK"></div>
    <h4 className="central c-FAV mt4 mb4">setup your team</h4>
    <div className="talent-container">
      {user.follows.length === 0 ?
      <p>get inspired by the community</p> : 
      user.follows.map(talent => 
        talent._id !== user._id &&
        <TalentToProjectCard 
          team={team} 
          setTeam={setTeam}
          key={talent._id}
          talent={talent}
          user={user} 
        />
      )}
    </div>


    {/*  - - - - - COMMUNITY - - - - - */}
    <div className="mb1 mt3 central">
        <h4 className="central c-FAV mt05">add new talents</h4>
      </div>
      <div className="talent-container">
          {noFollows && noFollows.map((talent) =>
          talent._id !== user._id &&
          <TalentToProjectCard 
            team={team} 
            setTeam={setTeam}
            key={talent._id}
            talent={talent}
            user={user} 
        />
      )}
      </div>
        

      {/*  - - - - - INVITATION - - - - - */}
      <div className="bo-DARK"></div>
      <div className="mb1 mt3 central">
        <h4 className="central c-FAV mt05">invite to improof</h4>
        </div>
        <div className="col">
          {eMailFields.map((el, i) => 
          <input 
            type="email" 
            name={`inviteOthers${i}`}
            onChange={inviteInputHandler}
            key={i}
          />           
          )} 
          
          <button 
            onClick={addEmailFields}
            disabled={eMailFields.length === 5}
            >{eMailFields.length === 5 ? "you can invite more people later in the project" :"+ email"}
          </button>
          <button 
            onClick={subEmailFields}
            disabled={eMailFields.length === 1}
            >- email
          </button>
        </div>

        <div className="bo-DARK"></div>
        <div className="col">
          <RadioPrivacy setPrivacy={setPrivacy}/>
          <button type="submit" className="mt2 bg-FAV">create your project!</button>
        </div>

      </form>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default CreateProject;