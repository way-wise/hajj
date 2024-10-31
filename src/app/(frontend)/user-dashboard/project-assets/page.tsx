import React, { FC } from 'react';

interface ProjectAssetsProps {

}

const ProjectAssets: FC<ProjectAssetsProps> = () => {
    return (
        <div className="flex flex-col lg:h-[700px] min-h-max w-full">
            <div className="bg-primary text-primary-foreground p-4">
                <h2 className="text-xl font-semibold">Project Assets</h2>
            </div>
        </div>
    );
};

export default ProjectAssets;