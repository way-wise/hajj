import React, { FC } from 'react';

interface ProfileProps {

}

const Profile: FC<ProfileProps> = () => {
    return (
        <div className="flex flex-col lg:h-[700px] min-h-max w-full">
            <div className="bg-primary text-primary-foreground p-4">
                <h2 className="text-xl font-semibold">Profile</h2>
            </div>
        </div>
    );
};

export default Profile;