import { useEffect, useState } from "react";
import Axios from "axios";
import { API_HOST } from "../../config/API";

function TaskBoard() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(`${API_HOST.url}/tasks/insert`, form);
      console.log("Submitted Task:", form);
      if (response.status === 200) {
        taskData();
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("Something wrong: ", err);
    }
  };

  const openModalEdit = (item) => {
    setSelectedItem(item);
    setOpenEdit(true);
  };

  const closeModalEdit = () => {
    setOpenEdit(false);
    setSelectedItem(null);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(`${API_HOST.url}/tasks/update/${selectedItem.id}`, selectedItem);
      if (response.status === 200) {
        taskData();
        setOpenEdit(false);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  useEffect(() => {
    taskData();
  }, []);

  const taskData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await Axios.get(`${API_HOST.url}/tasks`);

      const data = response.data;

      setTask(data);
    } catch (err) {
      setError("Failed to load files. Please try again.");
      console.error("error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    taskData();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("Delete task?")) {
      await Axios.delete(`${API_HOST.url}/tasks/delete/${selectedItem.id}`);

      alert("Successfully delete task");
      taskData();
      setOpenEdit(false);
      console.log("Successfully delete task");
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const bgColorMap = {
    inProgress: "bg-yellow-300",
    completed: "bg-green-300",
    wontDo: "bg-red-300",
    null: "bg-gray-300",
  };

  const bgStatus = {
    inProgress: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7.5" fill="#F8FAFC" fill-opacity="0.25"/>
                  <path d="M9.99999 4.46669C9.99999 4.32388 9.99999 4.25248 10.0467 4.20813C10.0934 4.16377 10.1622 4.16731 10.2999 4.1744C11.2196 4.22174 12.1166 4.4863 12.9167 4.94821C13.8034 5.46019 14.5398 6.19658 15.0518 7.08335C15.5638 7.97013 15.8333 8.97606 15.8333 10C15.8333 11.024 15.5638 12.0299 15.0518 12.9167C14.5398 13.8035 13.8034 14.5399 12.9167 15.0518C12.0299 15.5638 11.024 15.8334 9.99999 15.8334C8.97603 15.8334 7.9701 15.5638 7.08332 15.0518C6.28329 14.5899 5.60566 13.9454 5.10479 13.1725C5.02983 13.0569 4.99235 12.999 5.00741 12.9364C5.02247 12.8738 5.08431 12.8381 5.20798 12.7667L9.84999 10.0866C9.92319 10.0444 9.9598 10.0232 9.97989 9.98842C9.99999 9.95361 9.99999 9.91135 9.99999 9.82682V4.46669Z" fill="#F8FAFC"/>
                  </svg>`,
    completed: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16667 11.6667L6.73309 13.5915C7.16178 13.913 7.76772 13.8395 8.10705 13.4247L15 5" stroke="#FEF7EE" stroke-width="2" stroke-linecap="round"/>
                </svg>`,
    wontDo: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" fill="#F8FAFC" fill-opacity="0.25"/>
              <path d="M7.5 7.5L12.5 12.5" stroke="#F8FAFC" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M12.5 7.5L7.5 12.5" stroke="#F8FAFC" stroke-width="1.2" stroke-linecap="round"/>
              </svg>`,
  };

  const bgCardColor = {
    inProgress: "bg-orange-400",
    completed: "bg-green-400",
    wontDo: "bg-red-400",
  };

  return (
    <>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M16.3256 15.7191C18.3549 14.5476 21.645 14.5476 23.6742 15.7191L36.3256 23.0228C38.3548 24.1942 38.3548 26.0936 36.3256 27.2651L23.6742 34.5687C21.645 35.7402 18.3549 35.7402 16.3256 34.5687L3.6743 27.2651C1.64504 26.0936 1.64504 24.1942 3.6743 23.0228L16.3256 15.7191Z"
                fill="#E9A23B"
                fillOpacity="0.2"
              />
              <path
                d="M16.3258 10.5097C18.355 9.33817 21.6451 9.33817 23.6744 10.5097L36.3257 17.8133C38.355 18.9848 38.355 20.8842 36.3257 22.0556L23.6744 29.3593C21.6451 30.5308 18.355 30.5308 16.3258 29.3593L3.67442 22.0556C1.64516 20.8841 1.64516 18.9848 3.67442 17.8133L16.3258 10.5097Z"
                fill="#E9A23B"
                fillOpacity="0.5"
              />
              <path
                d="M16.3258 5.12118C18.355 3.94968 21.6451 3.94968 23.6744 5.12118L36.3257 12.4248C38.355 13.5963 38.355 15.4957 36.3257 16.6672L23.6744 23.9708C21.6451 25.1423 18.355 25.1423 16.3258 23.9708L3.67442 16.6671C1.64516 15.4957 1.64516 13.5963 3.67442 12.4248L16.3258 5.12118Z"
                fill="#E9A23B"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold">My Task Board</h1>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M13.5 5.5L6.45321 12.5468C6.22845 12.7716 6.11607 12.8839 6.04454 13.0229C5.97301 13.1619 5.94689 13.3187 5.89463 13.6322L5.11508 18.3095C5.06262 18.6243 5.03639 18.7817 5.12736 18.8726C5.21833 18.9636 5.37571 18.9374 5.69048 18.8849L10.3678 18.1054L10.3678 18.1054C10.6813 18.0531 10.8381 18.027 10.9771 17.9555C11.1161 17.8839 11.2284 17.7716 11.4532 17.5468L11.4532 17.5468L18.5 10.5C19.5171 9.48295 20.0256 8.97442 20.1384 8.36277C20.1826 8.12295 20.1826 7.87705 20.1384 7.63723C20.0256 7.02558 19.5171 6.51705 18.5 5.5C17.4829 4.48295 16.9744 3.97442 16.3628 3.8616C16.1229 3.81737 15.8771 3.81737 15.6372 3.8616C15.0256 3.97442 14.5171 4.48294 13.5 5.5Z"
                fill="#030616"
                fillOpacity="0.25"
              />
              <path
                d="M12.2929 6.70711L6.45321 12.5468C6.22845 12.7716 6.11607 12.8839 6.04454 13.0229C5.97301 13.1619 5.94689 13.3187 5.89463 13.6322L5.11508 18.3095C5.06262 18.6243 5.03639 18.7817 5.12736 18.8726C5.21833 18.9636 5.37571 18.9374 5.69048 18.8849L10.3678 18.1054L10.3678 18.1054C10.6813 18.0531 10.8381 18.027 10.9771 17.9555C11.1161 17.8839 11.2284 17.7716 11.4532 17.5468L11.4532 17.5468L17.2929 11.7071C17.6262 11.3738 17.7929 11.2071 17.7929 11C17.7929 10.7929 17.6262 10.6262 17.2929 10.2929L17.2929 10.2929L13.7071 6.70711C13.3738 6.37377 13.2071 6.20711 13 6.20711C12.7929 6.20711 12.6262 6.37377 12.2929 6.70711Z"
                fill="#030616"
              />
            </svg>
          </span>
        </div>
        <p className="font-semibold mb-2">Tasks to keep organised</p>

        {/* Task Cards */}
        <div className="space-y-3">
          {/* Task in Progress */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-5">
              <div className="w-8 h-8 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading Tasks...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center flex items-center justify-center space-x-2" role="alert">
              <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.366-.756 1.414-.756 1.78 0l6.518 13.455A1 1 0 0 1 15.518 18H4.482a1 1 0 0 1-.9-1.446L8.257 3.1zM11 14a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1-8a1 1 0 0 0-.993.883L9 7v4a1 1 0 0 0 1.993.117L11 11V7a1 1 0 0 0-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          ) : task?.length > 0 ? (
            <>
              {task.map((item, index) => (
                <div className={`${bgColorMap[item?.status]} p-4 rounded-lg cursor-pointer`} key={index} onClick={() => openModalEdit(item)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>
                        <i className={`${item?.icon}`}></i>
                      </span>
                      <span className="font-semibold">{item?.name}</span>
                    </div>
                    {item?.status && (
                      <button className={`${bgCardColor[item?.status]} text-white rounded w-8 h-8 flex items-center justify-center`}>
                        <span dangerouslySetInnerHTML={{ __html: bgStatus[item?.status] }} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-2">{item?.description}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg className="mx-auto w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2H3V4Zm0 4h18v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8Zm5 3v2h8v-2H8Zm0 4v2h5v-2H8Z" />
                </svg>
              </div>
              <h5 className="text-gray-500 text-lg font-semibold">No Tasks available</h5>
              <p className="text-gray-500 mb-4">Your Task is empty. Create some Task to get started.</p>
              <button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.293 6.707a1 1 0 011.414 0L8 9V5a1 1 0 112 0v4l2.293-2.293a1 1 0 111.414 1.414L10 13 4.293 7.707a1 1 0 010-1.414z" />
                </svg>
                Check Again
              </button>
            </div>
          )}
          {/* Add New Task */}
          <div className="flex items-center justify-between bg-yellow-200 p-4 rounded-lg cursor-pointer" onClick={() => setOpen(true)}>
            <div className="flex items-center space-x-2">
              <span className="bg-orange-400 text-white rounded w-9 h-9 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#F8FAFC" fillOpacity="0.25" />
                  <path d="M12 8L12 16" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M16 12L8 12" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-semibold">Add new task</span>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Overlay Create Task */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-bold mb-4">Task details</h2>

            {/* Form Start */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex gap-2">
                  {["fa fa-alarm-clock", "fa-solid fa-comment-dots", "fa fa-mug-hot", "fa fa-dumbbell", "fa fa-book"].map((emoji) => (
                    <label key={emoji} className="cursor-pointer">
                      <input type="radio" name="icon" value={emoji} checked={form.icon === emoji} onChange={handleChange} className="hidden" />
                      <div className={`text-2xl p-2 border rounded hover:bg-yellow-300 ${form.icon === emoji ? "bg-yellow-300 border-yellow-400" : "bg-gray-100"}`}>
                        <i className={`${emoji}`}></i>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
            {/* Form End */}

            {/* Close Icon */}
            <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl" onClick={() => setOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.5" fill="#E9A23B" fillOpacity="0.25" />
                <path d="M7.5 7.5L12.5 12.5" stroke="#E9A23B" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12.5 7.5L7.5 12.5" stroke="#E9A23B" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal Overlay Edit Task */}
      {openEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-bold mb-4">Task details</h2>

            {/* Form Start */}
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input type="text" name="name" value={selectedItem.name} onChange={handleChangeEdit} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" value={selectedItem.description} onChange={handleChangeEdit} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex gap-2">
                  {["fa fa-alarm-clock", "fa-solid fa-comment-dots", "fa fa-mug-hot", "fa fa-dumbbell", "fa fa-book"].map((emoji) => (
                    <label key={emoji} className="cursor-pointer">
                      <input type="radio" name="icon" value={emoji} checked={selectedItem.icon === emoji} onChange={handleChangeEdit} className="hidden" />
                      <div className={`text-2xl p-2 border rounded hover:bg-yellow-300 ${selectedItem.icon === emoji ? "bg-yellow-300 border-yellow-400" : "bg-gray-100"}`}>
                        <i className={`${emoji}`}></i>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="space-y-2">
                  {["inProgress", "completed", "wontDo"].map((statusKey) => (
                    <label
                      key={statusKey}
                      className={`flex items-center justify-between p-3 border rounded cursor-pointer transition ${selectedItem.status === statusKey ? "bg-yellow-300 border-yellow-400" : "bg-gray-100 border-gray-300"}`}
                    >
                      <input type="radio" name="status" value={statusKey} checked={selectedItem.status === statusKey} onChange={handleChangeEdit} className="hidden" />
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 flex items-center justify-center rounded ${bgCardColor[statusKey]}`} dangerouslySetInnerHTML={{ __html: bgStatus[statusKey] }} />
                        <span className="font-semibold capitalize text-sm">{statusKey}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800" onClick={handleDelete}>
                  <i className="fa fa-trash"></i> Delete
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">
                  <i className="fa fa-check"></i> Save
                </button>
              </div>
            </form>
            {/* Form End */}

            {/* Close Icon */}
            <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl" onClick={closeModalEdit}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.5" fill="#E9A23B" fillOpacity="0.25" />
                <path d="M7.5 7.5L12.5 12.5" stroke="#E9A23B" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12.5 7.5L7.5 12.5" stroke="#E9A23B" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskBoard;
