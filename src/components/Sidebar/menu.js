import Item from './item';
import { useTranslation } from "react-i18next";

const Menu = ({ data, isLoading, showMenu }) => {
  const { t } = useTranslation();
  return showMenu ? (
    <div className="space-y-2">
      <h5 className="text-sm font-bold text-gray-400">{t(data.name)}</h5>
      <ul className="ml-5 leading-10">
        {data.menuItems.map((entry, index) => (
          <Item key={index} data={entry} isLoading={isLoading} />
        ))}
      </ul>
    </div>
  ) : null;
};

Menu.defaultProps = {
  isLoading: false,
  showMenu: false,
};

export default Menu;
