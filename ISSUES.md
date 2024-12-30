# Known Issues

[English](#english) | [Русский](#russian)

# English

## Current Known Issues

### Performance Issues

#### Excessive Component Re-rendering
1. **Problem**: Some components are re-rendering more frequently than necessary, particularly in:
   - Post list components when updating likes
   - Comment sections when new comments are added
   - User profile sections when updating follower counts
   
2. **Workaround**: 
   - Use React.memo for components that don't need frequent updates
   - Implement useMemo and useCallback hooks for expensive computations
   - Consider using state management solutions for specific components instead of global context

### Code Structure Issues

#### Complex Page Structure
1. **Problem**: Some pages have overly complex structure and are difficult to maintain:
   - Admin dashboard page has too many nested components
   - Post detail page combines too many features in one component
   - Profile page has complex state management

2. **Workaround**:
   - Split complex pages into smaller, more manageable components
   - Move business logic to custom hooks
   - Use composition instead of deep nesting
   - Consider implementing a feature-based folder structure

### Other Issues

#### Image Optimization
1. **Problem**: Large images can cause performance issues on slower connections
2. **Workaround**: Use Next.js Image component with proper sizing and optimization

#### Mobile Navigation
1. **Problem**: Some UI elements are difficult to interact with on mobile devices
2. **Workaround**: Implement mobile-specific navigation patterns

# Русский

## Текущие известные проблемы

### Проблемы производительности

#### Излишний ререндер компонентов
1. **Проблема**: Некоторые компоненты перерисовываются чаще, чем необходимо, особенно в:
   - Компонентах списка постов при обновлении лайков
   - Секциях комментариев при добавлении новых комментариев
   - Разделах профиля пользователя при обновлении счетчиков подписчиков
   
2. **Решение**: 
   - Использовать React.memo для компонентов, не требующих частых обновлений
   - Внедрить хуки useMemo и useCallback для ресурсоемких вычислений
   - Рассмотреть использование локального управления состоянием вместо глобального контекста

### Проблемы структуры кода

#### Сложная структура страниц
1. **Проблема**: Некоторые страницы имеют излишне сложную структуру и трудны в поддержке:
   - Страница панели администратора имеет слишком много вложенных компонентов
   - Страница деталей поста объединяет слишком много функций в одном компоненте
   - Страница профиля имеет сложное управление состоянием

2. **Решение**:
   - Разделить сложные страницы на меньшие, более управляемые компоненты
   - Перенести бизнес-логику в пользовательские хуки
   - Использовать композицию вместо глубокой вложенности
   - Рассмотреть внедрение структуры папок на основе функциональности

### Другие проблемы

#### Оптимизация изображений
1. **Проблема**: Большие изображения могут вызывать проблемы с производительностью на медленных соединениях
2. **Решение**: Использовать компонент Next.js Image с правильным размером и оптимизацией

#### Мобильная навигация
1. **Проблема**: Некоторые элементы интерфейса сложно использовать на мобильных устройствах
2. **Решение**: Внедрить специальные паттерны навигации для мобильных устройств

---

Note: This list is regularly updated as new issues are discovered and resolved. | Примечание: Этот список регулярно обновляется по мере обнаружения и решения новых проблем. 