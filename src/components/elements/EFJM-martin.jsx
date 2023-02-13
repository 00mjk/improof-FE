import { FaLinkedinIn as LinkedIn } from "react-icons/fa"
import { FaXing as Xing } from "react-icons/fa"
import { AiFillGithub as GitHub } from "react-icons/ai"
import { TbWorld as Website} from "react-icons/tb"


const Martin = () => {
    return (
        <>
            <div className="card efjm-card rel col">
                <div className="central mb2">
                    <div className="efjm-avatar-container bg-FAV central">
                        <h1>MG</h1>
                    </div>
                    <div className="mt5 col">
                        <h3 className="c-FAV center mb05">Martin Groß</h3>
                        <p className="c-A60">"Everything is design!"</p>
                    </div>
                </div>
                <div>
                    <div className="col mb1">
                        <p className="c-FAV">Mein Bereich:</p>
                        <p>UI-Designer, loves UX, knows HTML, CSS, Sass, React, Id, Ps, Ai</p>
                    </div>
                    <div className="col mb1">
                        <p className="c-FAV">Meine Stärken</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores magni, quibusdam omnis alias illum quos!</p>
                    </div>
                </div>
                <div>
                    <div className="contact mt15 mb15">
                        <button className="efjm-icon circle30">
                            <div><LinkedIn /></div>
                        </button>
                        <button className="efjm-icon circle30">
                            <div><Xing /></div>
                        </button>
                        <button className="efjm-icon circle30">
                            <div className="fs15"><GitHub /></div>
                        </button>
                        <button className="efjm-icon circle30">
                            <div className="fs15"><Website /></div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Martin;