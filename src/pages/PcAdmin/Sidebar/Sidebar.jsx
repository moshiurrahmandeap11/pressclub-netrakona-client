import React from 'react';

const Sidebar = ({ onViewChange, currentView }) => {
    const navItemClasses = "p-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out";
    const activeClasses = "bg-teal-500 text-white font-semibold";
    const inactiveClasses = "hover:bg-gray-700";

    return (
        <aside className="w-full md:w-64 bg-gray-800 text-gray-200 p-5 flex-shrink-0">
            <h2 className="text-2xl font-bold text-center mb-10 text-white">অ্যাডমিন প্যানেল</h2>
            <nav>
                <ul className="space-y-2 md:space-y-4">
                    <li
                        className={`${navItemClasses} ${currentView === 'updates' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('updates')}
                    >
                        সর্বশেষ আপডেট
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'people' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('people')}
                    >
                        গুরুত্বপূর্ন ব্যাক্তিবর্গ
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'links' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('links')}
                    >
                        গুরুত্বপূর্ন লিংক্স
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'history' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('history')}
                    >
                        প্রেস ক্লাবের ইতিহাস 
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'headerslideshow' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('headerslideshow')}
                    >
                        ন্যাভবার স্লাইড শো  
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'slider' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('slider')}
                    >
                        স্লাইডার  
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'mishon-vishon' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('mishon-vishon')}
                    >
                        মিশন ও ভিশন   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'achievement' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('achievement')}
                    >
                        সাফল্য ও অর্জন   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'member-list' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('member-list')}
                    >
                        সদস্য তালিকা   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'adminstration' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('adminstration')}
                    >
                        প্রশাসন   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'media' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('media')}
                    >
                        মিডিয়া   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'committee' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('committee')}
                    >
                        কমিটি   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'gallery' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('gallery')}
                    >
                        গ্যালারি   
                    </li>
                    <li
                        className={`${navItemClasses} ${currentView === 'contact' ? activeClasses : inactiveClasses}`}
                        onClick={() => onViewChange('contact')}
                    >
                        যোগাযোগ   
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;