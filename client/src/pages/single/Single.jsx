import "./single.css"
import Sidebar from "../../components/sidebar/Sidebar"
import SinglePost from "../../components/singlePost/SinglePost"

export default function () {
  return (
    <div className='single'>
        <SinglePost />
        <Sidebar />
    </div>
  )
}
