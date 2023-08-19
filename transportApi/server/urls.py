from django.urls import re_path , path
from . import views
from trainapp import views as trainViews

urlpatterns = [
   re_path('login',views.login),
   re_path('signup',views.signup),
   re_path('test_token',views.test_token),
   re_path('users',views.get_user_list),
   re_path(r'^user/update/(?P<user_id>\d+)/$', views.update_user),

   ##  metro urls
   re_path('metros/add',views.add_metro),
   re_path('metros',views.get_metro_list),
   re_path(r'^delete/(?P<metro_id>\d+)/$',views.delete_metro),
   re_path(r'^get/(?P<metro_id>\d+)/$', views.get_metro_by_id),
   re_path(r'^update/(?P<metro_id>\d+)/$', views.update_metro),

   ## comment metro url
   re_path('post-comment/', views.post_comment),
   re_path('comments/',views.get_comment_list),
   path('comment/<int:comment_id>/delete/', views.delete_comment),


   ## trains url
   re_path('trains/add',trainViews.add_train),
   re_path('trains',trainViews.get_train_list),
   re_path(r'^train/delete/(?P<train_id>\d+)/$',trainViews.delete_train),
   re_path(r'^train/get/(?P<train_id>\d+)/$', trainViews.get_train_by_id),
   re_path(r'^train/update/(?P<train_id>\d+)/$', trainViews.update_train),

   ## comments train url
   re_path('add-train-comment/', trainViews.post_comment),
   re_path('all-train-comments/',trainViews.get_trains_comment_list), ## not working
   path('comment-train/<int:comment_id>/delete/', trainViews.delete_comment),


    ## Bus url
   re_path('bus/add',views.add_bus),
   re_path('buss',views.get_bus_list),
   re_path(r'^bus/delete/(?P<bus_id>\d+)/$',views.delete_bus),
   re_path(r'^bus/get/(?P<bus_id>\d+)/$', views.get_bus_by_id),

   ## comments bus url
   re_path('add-bus-comment/', views.post_bus_comment),
   re_path('bus/comments/',views.get_bus_comment_list), ## not working
   path('comment-bus/<int:comment_id>/delete/', views.delete_bus_comment),


   ## search methode url 
   path('api/search/', views.TransportSearchView.as_view()),
]
