import React, {Component} from 'react';
import '../css/main.scss';
import Config from "../config";
import i18n, {setLanguage} from '../localization/i18n';

const HOST = Config.getHost();

const i18nLangs = [
    {value: 'en', title: 'English', icon: 'icon-en'},
    {value: 'fr', title: 'French', icon: 'icon-fr'},
    {value: 'zh_cn', title: 'Chinese', icon: 'icon-zh'},
];

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showHeaderMenu: false,
            showLanguageMenu: false,
            showMyAccountMenu: false
        }
    }

    render() {
        let {
            showHeaderMenu,
            showLanguageMenu,  
            showMyAccountMenu
        } = this.state;

        return (
            <header className="header"> 
                <a href="/" className="header__logo">{i18n['ConX']}</a>
                <div className="header__nav">
                    <div className="header__nav-item" onClick={() => window.location.href = HOST+"/#overview"}>
                        {i18n['Overview']}
                    </div>
                    <div className="header__nav-item" onClick={() => window.location.href = HOST+"/#pricing"}>
                        {i18n['Plans & Pricing']}
                    </div>
                    <div className="header__nav-item" onClick={() => window.location.href = HOST+"/site/resources"}>
                        {i18n['Support']}
                    </div>
                    <div className="header__nav-item btn-grey" onClick={() => window.location.href = HOST+"/room/addNewRoom"}>
                        {i18n['Activate']}
                    </div>
                </div>
                <div className="header__right-nav">
                    <div className="header__right-nav-item">
                        <div className="my-account-menu__title" onClick={() => this.setState({ showMyAccountMenu: !this.state.showMyAccountMenu })}>{i18n['My Account']}</div> 
                        <ul className={"my-account-menu dropdown-menu" + (showMyAccountMenu ? ' active' : '')}>
                            <li onClick={() => window.location.href = HOST+"/meeting/index"} className="my-account-menu__item icon-nav-scedule">{i18n['Schedule a Meeting']}</li>
                            <li onClick={() => window.location.href = HOST+"/meeting/scheduled"} className="my-account-menu__item icon-nav-meetings">{i18n['Meetings']}</li>
                            <li onClick={() => window.location.href = HOST+"/setting/index"} className="my-account-menu__item icon-nav-profile">{i18n['Profile']}</li>
                            <li onClick={() => window.location.href = HOST+"/user/logout"} className="my-account-menu__item icon-nav-logout">{i18n['Logout']}</li> 
                        </ul> 
                    </div>
                    <div className="header__right-nav-item"> 
                        <a className="btn-black" href="http://conx.infocus.net/" target="_blank" rel="noopener noreferrer">{i18n['Join a' +
                        ' Meeting']}</a>
                    </div>
                </div>
                <div className="header__mobile">
                    <div className="header__mobile-title"
                        onClick={() => this.setState({ showHeaderMenu: !this.state.showHeaderMenu })}>
                        {i18n['Menu']}
                    </div>
                    <div className={"header__mobile-container" + (showHeaderMenu ? ' active' : '')}>
                            <div onClick={() => window.location.href = HOST+"/#overview"} className="header__mobile-item">{i18n['Overview']}</div>
                            <div onClick={() => window.location.href = HOST+"/#pricing"} className="header__mobile-item">{i18n['Plans & Pricing']}</div>
                            <div onClick={() => window.location.href = HOST+"/site/resources"} className="header__mobile-item">{i18n['Support']}</div>
                            <div onClick={() => window.location.href = HOST+"/meeting/index"} className="header__mobile-item">{i18n['My Account']}</div>
                            <div onClick={() => window.location.href = HOST+"/room/addNewRoom"} className="header__mobile-item">{i18n['Activate']}</div>
                            <div onClick={() => window.location.href = "http://conx.infocus.net/"} className="header__mobile-item" target="_blank">{i18n['Join a Meeting']}</div>
                            <div onClick={() => window.location.href = HOST+"/user/logout"} className="header__mobile-item">{i18n['Logout']}</div>
                    </div>
                </div>
                <div className="global-language">
                    <div className="global-language__earth" onClick={() => this.setState({ showLanguageMenu: !this.state.showLanguageMenu })}/> 
                    <ul className={"global-language__comtainer dropdown-menu" + (showLanguageMenu ? ' active' : '')}>
                        {i18nLangs.map(lang =>
                            <li key={lang.value} className={"global-language__item "+lang.icon}
                                onClick={() => this.changeLanguage(lang.value)}>
                                {i18n[lang.title]}
                            </li>)
                        }
                    </ul>
                </div>
                 
                {/* <div className="header__title">
                    <div className="header__title-name">{roomTitle}</div>
                    <div className="header__title-room">{roomAlias}</div>
                </div>
                <div className="header__link"><a className="link" href="https://www.infocusconx.com/site/resources" target="_blank">Need help?</a></div>
                <div className="header__sign-out" onClick={this.logout.bind(this)}>Sign out</div> */}
            </header>
        );
    }

    changeLanguage (langValue) {
        setLanguage(langValue);
    }
}

export default Header;
 