import { useCallback, useState } from "react";
import { ToastError, ToastSuccess } from "~/components/Toast/Toast";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { useAuth } from "~/utils/helpers";
import { UserProfile } from "~/utils/types/user.type";
import { LuAsterisk } from "react-icons/lu";
import { UserRole } from "~/store/AuthContext";

const ProfilePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal, setUserGlobal } = useAuth();
  const [userForm, setUserForm] = useState<Partial<UserProfile>>({
    name: userGlobal?.name || "",
    email: userGlobal?.email || "",
    phone: userGlobal?.phone.replace("+1", "") || "",
    address: userGlobal?.address || "",
  });
  const [accountSaving, setAccountSaving] = useState(false);

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserForm((prev) => ({ ...prev, name: event.target.value }));
    },
    []
  );

  const onChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserForm((prev) => ({ ...prev, email: event.target.value }));
    },
    []
  );

  const onChangeAddress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserForm((prev) => ({ ...prev, address: event.target.value }));
    },
    []
  );

  const onChangePhone = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/\D/g, "");
      setUserForm((prev) => ({ ...prev, phone: value }));
    },
    []
  );

  const handleUpdateProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setAccountSaving(true);
      await axiosPrivate.put(`/editProfile`, {
        name: userForm?.name,
        phone: `+1${userForm?.phone}`,
        email: userForm?.email,
        address: userForm?.address,
      });
      ToastSuccess("Profile updated successfully.");
      setUserGlobal((prev: UserProfile) => ({
        ...prev,
        name: userForm?.name,
        email: userForm?.email,
        phone: `+1${userForm?.phone}`,
        address: userForm?.address,
      }));
    } catch (error: any) {
      ToastError(error?.response?.data?.message);
    } finally {
      setAccountSaving(false);
    }
  };
  return (
    <div className="w-full bg-white p-6 rounded-lg flex flex-col">
      <div className="flex justify-center items-center mb-4">
        <div className="max-w-lg w-full bg-white p-6 rounded-lg flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-8">Profile</h1>
          <form onSubmit={handleUpdateProfile} className="w-full">
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Name <LuAsterisk color="red" />
              </label>
              <input
                onChange={onChangeName}
                value={userForm?.name || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Phone <LuAsterisk color="red" />
              </label>
              <input
                onChange={onChangePhone}
                value={userForm?.phone || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Email <LuAsterisk color="red" />
              </label>
              <input
                onChange={onChangeEmail}
                value={userForm?.email || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
                type="email"
              />
            </div>
            {userGlobal?.role === UserRole.STUDENT && (
              <div className="mb-4">
                <label className=" mb-2 font-semibold shad flex items-center">
                  Address
                </label>
                <input
                  onChange={onChangeAddress}
                  value={userForm?.address || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              disabled={accountSaving}
              className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
